package controllers

import (
	"fmt"

	"net/http"
	"os"
	"time"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/websines/ig-server/database"
	"golang.org/x/crypto/bcrypt"
)

const SecretKey = "secret"

//HashPassword; return hashed password and error
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// Compare hashed and entered password\; returns boolean
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

//POST /register

type CreateUserInput struct {
	User     string `json:"user" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type TokenClaims struct {
	Email  string
	Expiry int64
}

func RegisterUser(c *gin.Context) {
	var input CreateUserInput
	var tks TokenClaims

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tks.Email = input.Email
	tks.Expiry = time.Now().Add(time.Hour * 24 * 2).Unix()

	pass, err := HashPassword(input.Password)

	if err != nil {
		panic(err)
	}

	user := database.User{User: input.User, Email: input.Email, Password: pass}
	database.DB.Create(&user)

	tkClaims := jwt.MapClaims{}
	tkClaims["email"] = tks.Email
	tkClaims["expiry"] = tks.Expiry
	tk := jwt.NewWithClaims(jwt.SigningMethodHS256, tkClaims)
	token, err := tk.SignedString([]byte(os.Getenv("TOKEN_SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Cannot make token"})
	}

	from := mail.NewEmail(os.Getenv("SENDGRID_SENDER_USERNAME"), os.Getenv("SENDGRID_SENDER_EMAIL"))
	to := mail.NewEmail(input.User, input.Email)
	subject := "Verify your account"
	plainTextContent := "Click on the link below, valid for 48 hours"
	htmlContent := fmt.Sprintf("<a href='http://localhost:8080/verify/?token=%s'><h2>Click here</h2></a>", token)
	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_KEY"))
	response, err := client.Send(message)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not send email"})
	} else {
		c.JSON(http.StatusOK, gin.H{"message": response.Body})
	}

	lks := database.LikeStatus{IsAllowedToLike: true}
	database.DB.Create(&lks)

	c.JSON(http.StatusOK, gin.H{"data": user})
}

type Emails struct {
	Email string
}

func Verify(c *gin.Context) {
	var e Emails
	p := c.Request.URL.Query()
	tk := p["token"]

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tk[0], claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("TOKEN_SECRET")), nil
	})
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"message": "Some error"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		email, ok := claims["email"].(string)
		if !ok {
			c.JSON(http.StatusOK, gin.H{"message": err})
			return
		}
		e.Email = email
	}

	var user database.User
	database.DB.Where("email = ?", e.Email).First(&user)
	c.JSON(http.StatusOK, gin.H{"message": user})

	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No such user exists"})
		return
	} else {
		user.IsVerified = true
		database.DB.Save(&user)
		c.JSON(http.StatusOK, gin.H{"message": "Verified"})
	}
}

//POST /login

func LoginUser(c *gin.Context) {
	var data map[string]string

	if err := c.BindJSON(&data); err != nil {
		return
	}

	var user database.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "No such user exists"})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data["password"]))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Password is incorrect"})
		return
	}

	ts, err := CreateToken(uint64(user.ID))
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	saveErr := CreateAuth(uint64(user.ID), ts)
	if saveErr != nil {
		c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
	}
	tokens := map[string]string{
		"access_token":  ts.AccessToken,
		"refresh_token": ts.RefreshToken,
	}

	c.JSON(http.StatusOK, tokens)
}

func Logout(c *gin.Context) {
	au, err := ExtractTokenMetadata(c.Request)
	if err != nil {
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	deleted, delErr := DeleteAuth(au.AccessUuid)
	if delErr != nil || deleted == 0 { //if any goes wrong
		c.JSON(http.StatusUnauthorized, "unauthorized")
		return
	}
	c.JSON(http.StatusOK, "Successfully logged out")
}

func TokenAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := TokenValid(c.Request)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			c.Abort()
			return
		}
		c.Next()
	}
}
