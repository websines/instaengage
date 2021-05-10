package database

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	User          string        `json:"user"`
	Email         string        `gorm:"typevarchar(100);unique_index" json:"email"`
	Password      string        `json:"-"`
	IsVerified    bool          `json:"verified" gorm:"default:false"`
	CommentReq    CommentReq    `json:"comments"`
	AssignedProxy AssignedProxy `json:"proxy_server"`
	UserSession   UserSession   `json:"user_session"`
}

type LikeStatus struct {
	gorm.Model
	IsAllowedToLike   bool   `json:"is_allowed_to_like" gorm:"default:true"`
	ExcludeFromLiking string `json:"excluded_account"`
	UserID            uint64 `json:"user_id"`
}

type CommentReq struct {
	gorm.Model
	CommentText string `json:"comment_text"`
	UserID      uint64 `json:"user_id"`
}

type AssignedProxy struct {
	gorm.Model
	ProxyServer string `json:"proxy_server"`
	UserID      uint64 `json:"user_id"`
}

type UserSession struct {
	gorm.Model
	Session string `json:"encoded_session"`
	UserID  uint64 `json:"user_id"`
}

type Proxy struct {
	gorm.Model
	Proxy string `json:"proxy"`
}
