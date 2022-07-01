package models

import (
	"github.com/dgrijalva/jwt-go"
)

// User represents a User schema
type User struct {
	Base
	Email    string `json:"email" gorm:"unique"`
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"`
}

// UserErrors represent the error format for user routes
type UserErrors struct {
	Err      bool   `json:"error"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	jwt.StandardClaims
	ID uint `gorm:"primaryKey"`
}

// detail contains the details of each hotel
type Detail struct {
	Id       string `json:"hotelid"`
	Roomfree uint64 `json:"roomfree"`
	Food     string `json:"food"`
	Price    uint64 `json:"price"`
}

// booking struct contains the details of hotel booked by the user
type Booking struct {
	User      string `json:"username"`
	Id        string `json:"hotelid"`
	Adult     uint64 `json:"adult"`    // no of adults
	Children  uint64 `json:"children"` //no of children
	EntryDate string `json:"entrydate"`
	ExitDate  string `json:"exitdate"`
	Roomtype  string `json:"roomtype"`
	Rooms     uint64 `json:"roomno"` //no of rooms
	Price     uint64 `json:"price"`
}

var VerifiedUser string
