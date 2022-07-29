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
		//Price     uint64 `json:"price"`
	}

	input := new(iteminput)
	if err := c.BodyParser(input); err != nil {
		return c.JSON(fiber.Map{
			"error":  true,
			"status": "incorrect input",
		})
	}

	var hotel models.Detail

	response := db.DB.Where("id =?", input.Id).Find(&hotel)
	response.Scan(&hotel)

	item := models.Booking{
		User:      fmt.Sprint(models.VerifiedUser),
		Id:        input.Id,
		Name:      hotel.Name,
		Adult:     input.Adult,
		Children:  input.Children,
		EntryDate: input.EntryDate,
		ExitDate:  input.ExitDate,
		Roomtype:  input.Roomtype,
		Rooms:     input.Rooms,
		Price:     ((hotel.Price) * (input.Rooms)),
	}

	fmt.Println(item)
	//fmt.Println(input.Rooms)

	var count uint64

	res := db.DB.Select("roomfree").Where("id = ?", input.Id).Find(&models.Detail{})
	res.Scan(&count)
	fmt.Println(count)

	if count < input.Rooms {
		return c.JSON(fiber.Map{
			"error": true,
			"msg":   "no room available",
		})
	}

	err := db.DB.Create(&item).Error
	if err != nil {
		return c.JSON(fiber.Map{
			"error": err,
			"msg":   "Something went wrong, please try again later. 😕",
		})

	}

	count = count - input.Rooms
	fmt.Println(count)

	error := db.DB.Table("details").Where("id = ?", input.Id).Update("roomfree", count).Error
	if error != nil {
		fmt.Println(error)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "booking successfull",
	})
}

//function for removing purchased item data
func DeleteEntry(c *fiber.Ctx) error {

	type iteminput struct {
		Id string `json:"hotelid"`
	}

	input := new(iteminput)
	if err := c.BodyParser(input); err != nil {
		return c.JSON(fiber.Map{
			"error":  true,
			"status": "incorrect input",
		})
	}
	fmt.Println(input.Id)

	var amount uint64
	db.DB.Table("bookings").Select("rooms").Where("\"user\" = ? AND Id = ?", models.VerifiedUser, input.Id).Scan(&amount)
	fmt.Println(amount)

	if res := db.DB.Where("\"user\" = ? AND Id = ?", models.VerifiedUser, input.Id).Delete(&models.Booking{}); res.RowsAffected <= 0 {
		return c.JSON(fiber.Map{
			"msg": "invalid input",
		})
	} else {
		var count uint64
		db.DB.Table("details").Select("roomfree").Where("Id = ?", input.Id).Scan(&count)

		count = count + amount
		fmt.Println(count)
		db.DB.Table("details").Where("Id = ?", input.Id).Update("roomfree", count)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "cancellation successfull",
	})
}

func Createhotelcookie(c *fiber.Ctx) error {
	type iteminput struct {
		Id string `json:"hotelid"`
	}
	input := new(iteminput)

	if err := c.BodyParser(input); err != nil {
		return c.JSON(fiber.Map{
			"error": true,
			"msg":   "cannot parse data",
		})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "hotel_id",
		Value:    fmt.Sprint(input.Id),
		HTTPOnly: true,
		Secure:   true,
	})

	return c.JSON(fiber.Map{
		"error": false,
		"msg":   "cookie successfully created",
	})

}

func Showhotel(c *fiber.Ctx) error {
	id := c.Cookies("hotel_id")
	//hotelid, err := strconv.Atoi(id)

	/*if err != nil {
		return c.JSON(fiber.Map{
			"error": true,
			"msg":   "cannot convert hotel cookie",
		})
	}*/

	var hotel models.Detail

	if res := db.DB.Table("details").Where("id =?", id).Find(&hotel); res.RowsAffected <= 0 {
		fmt.Println("hotel not found")
		return nil
	}

	return c.JSON(hotel)
}
