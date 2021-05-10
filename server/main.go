package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/jasonlvhit/gocron"
	"github.com/websines/ig-server/controllers"
	"github.com/websines/ig-server/database"

	"github.com/websines/ig-server/instagram"
	"github.com/websines/ig-server/redis"
)

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	//GIN HTTP2 Router
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(CORS())

	redis.RedisInit()

	database.InitDB()

	r.POST("/register", controllers.RegisterUser)
	r.POST("/login", controllers.LoginUser)
	r.POST("/comment", controllers.CreateComment)
	r.POST("/logout", controllers.Logout)
	r.POST("/token/refresh", controllers.Refresh)
	r.POST("/login/insta", controllers.InstaLogin)
	r.POST("/post/comment", controllers.MakeCommentonPost)
	r.POST("/add/proxy", controllers.EnterProxy)
	r.POST("/like/allow", controllers.IsAllowedToLikeRoute)
	r.POST("/like/exclude", controllers.IsExcluded)
	r.POST("/verify", controllers.Verify)

	r.GET("/user/insta", controllers.GetAccountDetails)
	r.GET("/users/me", controllers.GetUserDetails)
	r.GET("/insta/verify", controllers.VerifySessionExists)

	go func() {
		gocron.Every(10).Minutes().Do(func() {
			instagram.Like()
		})

		<-gocron.Start()
	}()

	r.Run()
}
