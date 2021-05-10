package database

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASS"), os.Getenv("DB_NAME"), os.Getenv("DB_PORT"))
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("Error: ", err)
		panic("Failed to connect to DB")
	} else {
		fmt.Println("Connected successfully!")
	}

	db.AutoMigrate(&User{}, &CommentReq{}, &UserSession{}, &AssignedProxy{}, &LikeStatus{}, &Proxy{})

	DB = db
}
