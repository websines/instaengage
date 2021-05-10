package controllers

import (
	"net/http"

	"github.com/ahmdrz/goinsta/v2"
	"github.com/gin-gonic/gin"
	"github.com/websines/ig-server/database"
	"github.com/websines/ig-server/instagram"
	"github.com/websines/ig-server/utilities"
)

// POST /comment

func CreateComment(c *gin.Context) {
	var data map[string]string

	if err := c.ShouldBindJSON(&data); err != nil {
		return
	}

	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	cmt := data["comment_text"]
	comment := database.CommentReq{CommentText: cmt, UserID: userId}

	var cmdb database.CommentReq

	if database.DB.Where("user_id = ?", userId).First(&cmdb).Update("comment_text", cmt).RowsAffected == 0 {
		database.DB.Create(&comment)
	}

	c.JSON(http.StatusOK, "success")

}

// POST /insta/login

func InstaLogin(c *gin.Context) {
	var data map[string]string

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Input"})
		return
	}

	username := data["username"]
	password := data["password"]

	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	//Login to insta
	insta := goinsta.New(username, password)

	//Verification challenge handling
	if err := insta.Login(); err != nil {
		switch v := err.(type) {

		case goinsta.ChallengeError:
			err := insta.Challenge.Process(v.Challenge.APIPath)

			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed verification process"})
				return
			}

			insta.Account = insta.Challenge.LoggedInUser

		default:

			c.JSON(http.StatusBadRequest, gin.H{"message": "Bad request, please try again"})
		}
	}

	//Creating encoded session object
	session, err := utilities.ExportAsBase64String(insta)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to create an encoded object"})
		return
	}

	//Assign session to database
	s := database.UserSession{Session: session, UserID: userId}

	database.DB.Create(&s)

	//Assign a random proxy

	proxy := utilities.ProxyDistributor()

	p := database.AssignedProxy{ProxyServer: proxy, UserID: userId}

	database.DB.Create(&p)

	defer insta.Logout()

	c.JSON(http.StatusOK, gin.H{"message": "Login Success"})
}

type UserData struct {
	FollowersCount int    `json:"follower_count"`
	FollowingCount int    `json:"following_count"`
	Name           string `json:"username"`
	ProfileImage   string `json:"profile_url"`
}

//GET /user/insta

func GetAccountDetails(c *gin.Context) {

	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	//Fetch Session from DB
	var sess database.UserSession
	var pxs database.AssignedProxy

	database.DB.Where("user_id = ?", userId).First(&sess)
	database.DB.Where("user_id = ?", userId).First(&pxs)

	s := sess.Session
	px := pxs.ProxyServer

	insta, err := utilities.ImportFromBase64String(s)
	insta.SetProxy(px, true)

	defer insta.Logout()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "User Session not found, please login again"})
		return
	}

	var u UserData

	user, err := insta.Profiles.ByID(insta.Account.ID)

	if err != nil {
		panic(err)
	}

	u.FollowersCount = user.FollowerCount
	u.FollowingCount = user.FollowingCount
	u.Name = user.Username
	u.ProfileImage = user.HdProfilePicURLInfo.URL

	c.JSON(http.StatusOK, gin.H{"data": u})

}

//GET /insta/verify

func VerifySessionExists(c *gin.Context) {
	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	//Fetch Session from DB
	var sess database.UserSession

	database.DB.Where("user_id = ?", userId).First(&sess)

	s := sess.Session

	if s != "" {
		c.JSON(http.StatusOK, gin.H{"message": "Session Exists"})
		return
	} else if s == "" {
		c.JSON(http.StatusNotFound, gin.H{"message": "Session not found, please login again"})
	}
}

// POST /post/comment

func MakeCommentonPost(c *gin.Context) {
	var data map[string]string

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Input"})
		return
	}

	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	var cmt database.CommentReq

	database.DB.Where("user_id = ?", userId).First(&cmt)

	text := cmt.CommentText
	shortID := data["short_id"]

	if text != "" {
		c.JSON(http.StatusOK, gin.H{"message": "Commenting on your post with all accounts"})
		instagram.Comment(text, shortID)
		return
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Either comment text is empty or your media does not exist"})
		return
	}
}

type UserDetails struct {
	UserID            uint64 `json:"user_id"`
	Username          string `json:"username"`
	Email             string `json:"email"`
	Comment           string `json:"comment_text"`
	IsVerified        bool   `json:"is_verified"`
	IsAllowedToLike   bool   `json:"is_allowed_to_like"`
	ExcludeFromLiking string `json:"excluded_account"`
}

//GET /users/me; returns authenticated user
func GetUserDetails(c *gin.Context) {
	var ud UserDetails

	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	var user database.User
	var like database.LikeStatus
	var cmt database.CommentReq

	database.DB.Where("id = ?", userId).First(&user)
	database.DB.Where("user_id = ?", userId).First(&like)
	database.DB.Where("user_id = ?", userId).First(&cmt)

	ud.UserID = userId
	ud.Username = user.User
	ud.IsVerified = user.IsVerified
	ud.IsAllowedToLike = like.IsAllowedToLike
	ud.ExcludeFromLiking = like.ExcludeFromLiking
	ud.Email = user.Email
	ud.Comment = cmt.CommentText

	c.JSON(http.StatusOK, gin.H{"data": ud})
}

func EnterProxy(c *gin.Context) {
	var data map[string]string

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid Input"})
		return
	}

	pxi := data["proxy"]

	px := database.Proxy{Proxy: pxi}

	database.DB.Create(&px)

	c.JSON(http.StatusOK, gin.H{"message": "Created"})

}

type CreateLikeInput struct {
	IsAllowedToLike bool `json:"is_allowed_to_like"`
}

//POST like/allow

func IsAllowedToLikeRoute(c *gin.Context) {
	var data CreateLikeInput
	var ls database.LikeStatus

	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	database.DB.Where("id = ?", userId).First(&ls)

	lsts := database.LikeStatus{IsAllowedToLike: data.IsAllowedToLike, ExcludeFromLiking: "null", UserID: userId}

	if database.DB.Where("user_id = ?", userId).First(&ls).Update("is_allowed_to_like", data.IsAllowedToLike).RowsAffected == 0 {
		database.DB.Create(&lsts)
	}

	c.JSON(http.StatusOK, "finished")

}

//POST /like/exclude

type Exclude struct {
	ExcludeFromLiking string `json:"excluded_account"`
}

func IsExcluded(c *gin.Context) {
	var data Exclude
	var ls database.LikeStatus

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokenAuth, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	userId, err := FetchAuth(tokenAuth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}

	database.DB.Where("id = ?", userId).First(&ls)

	lsts := database.LikeStatus{ExcludeFromLiking: data.ExcludeFromLiking, UserID: userId}

	if database.DB.Where("user_id = ?", userId).First(&ls).Update("exclude_from_liking", data.ExcludeFromLiking).RowsAffected == 0 {
		database.DB.Create(&lsts)
	}

	c.JSON(http.StatusOK, "finished")
}
