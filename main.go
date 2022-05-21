package main

import (
	"github.com/gofiber/fiber/v2"
	/* "github.com/task/config" */
	"github.com/task/database"
	"github.com/task/router"
	/* "golang.org/x/oauth2"
	"golang.org/x/oauth2/google" */)

/* var (
	googleOauthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:3000/callback",
		ClientID:     config.Config("Client_ID"),
		ClientSecret: config.Config("Client_Secret"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}
) */

func main() {

	app := fiber.New()
	/*app.Get("/", func(c *fiber.Ctx) error {
		err := c.SendString("And the API is UP!")
		return err
	})*/

	database.ConnectDB()

	router.SetupRoutes(app)

	app.Static("/", "./fend")
	// Listen on PORT 3000
	app.Listen(":3000")

}
