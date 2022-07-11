package private

import (
	//"math/rand"
	//"time"

	"fmt"

	db "github.com/task/database"
	"github.com/task/models"

	"github.com/gofiber/fiber/v2"
)

//function for entering purchased item details in DB
func CreateEntry(c *fiber.Ctx) error {

	type iteminput struct {
		Id        string `json:"hotelid"`
		Adult     uint64 `json:"adult"`    // no of adults
		Children  uint64 `json:"children"` //no of children
		EntryDate string `json:"entrydate"`
		ExitDate  string `json:"exitdate"`
		Roomtype  string `json:"roomtype"`
		Rooms     uint64 `json:"roomno"` //no of rooms
		Price     uint64 `json:"price"`
	}

	input := new(iteminput)
	if err := c.BodyParser(input); err != nil {
		return c.JSON(fiber.Map{
			"error":  true,
			"status": "incorrect input",
		})
	}
	//var name string = "hello"
	//fmt.Println(models.VerifiedUser)
	item := models.Booking{
		User:      fmt.Sprint(models.VerifiedUser),
		Id:        input.Id,
		Adult:     input.Adult,
		Children:  input.Children,
		EntryDate: input.EntryDate,
		ExitDate:  input.ExitDate,
		Roomtype:  input.Roomtype,
		Rooms:     input.Rooms,
		Price:     input.Price,
	}

	fmt.Println(item)

	err := db.DB.Create(&item)
	if err != nil {
		return c.JSON(fiber.Map{
			"error": err,
			"msg":   "Something went wrong, please try again later. 😕",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "booking successfull",
	})
}

//function for removing purchased item data
func DeleteEntry(c *fiber.Ctx) error {

	type iteminput struct {
		Bookid   uint32 `json:"bookid"`
		Bookname string `json:"bookname"`
		Isbn     string `json:"isbn"`
		Price    uint64 `json:"price"`
	}

	input := new(iteminput)
	if err := c.BodyParser(input); err != nil {
		return c.JSON(fiber.Map{
			"error":  true,
			"status": "incorrect input",
		})
	}

	item := new(models.Booking)

	if res := db.DB.Where("\"user\" = ? AND bookid =  AND isbn = ", models.VerifiedUser).Delete(&item); res.RowsAffected <= 0 {
		return c.JSON(fiber.Map{
			"msg": "invalid input",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "cancellation successfull",
	})
}
