package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/task/database"
)

func main() {

	app := fiber.New()
	app.Get("/", func(c *fiber.Ctx) error {
		err := c.SendString("And the API is UP!")
		return err
	})

	database.ConnectDB()

	// Listen on PORT 3000
	app.Listen(":3000")

}
