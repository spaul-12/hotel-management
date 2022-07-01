package router

import (
	//"context"
	//"fmt"
	//"io/ioutil"
	"math/rand"
	//"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/task/private"

	//"github.com/task/config"
	db "github.com/task/database"
	"github.com/task/models"
	"github.com/task/util"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte(os.Getenv("PRIV_KEY"))

// SetupUserRoutes func sets up all the user routes
func SetupUserRoutes() {
	USER.Post("/signup", CreateUser)              // Sign Up a user
	USER.Post("/signin", LoginUser)               // Sign In a user
	USER.Get("/get-access-token", GetAccessToken) // returns a new access_token

	//USER.Post("/google/login", Login)
	//USER.Post("/api/oauth2/callback", Callback)

	// privUser handles all the private user routes that requires authentication
	privUser := USER.Group("/private")
	privUser.Use(util.SecureAuth()) // middleware to secure all routes for this group
	privUser.Get("/user", GetUserData)
	privUser.Post("/addentry", private.CreateEntry)
	privUser.Post("/deleteentry", private.DeleteEntry)

}

// CreateUser route registers a User into the database
func CreateUser(c *fiber.Ctx) error {
	u := new(models.User)

	if err := c.BodyParser(u); err != nil {
		return c.JSON(fiber.Map{
			"error": true,
			"input": "Please review your input",
		})
	}
	// validate if the email, username and password are in correct format
	errors := util.ValidateRegister(u)
	if errors.Err {
		return c.JSON(errors)
	}

	if count := db.DB.Where(&models.User{Email: u.Email}).First(new(models.User)).RowsAffected; count > 0 {
		errors.Err, errors.Email = true, "Email is already registered"
	}
	if count := db.DB.Where(&models.User{Username: u.Username}).First(new(models.User)).RowsAffected; count > 0 {
		errors.Err, errors.Username = true, "Username is already registered"
	}

	if errors.Err {
		return c.JSON(errors)
	}
	// Hashing the password with a random salt
	password := []byte(u.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword(
		password,
		rand.Intn(bcrypt.MaxCost-bcrypt.MinCost)+bcrypt.MinCost,
	)

	if err != nil {
		panic(err)
	}
	u.Password = string(hashedPassword)
	if err := db.DB.Create(&u).Error; err != nil {
		return c.JSON(fiber.Map{
			"error":   true,
			"general": "Something went wrong, please try again later. 😕",
		})
	}

	// setting up the authorization cookies
	accessToken, refreshToken := util.GenerateTokens(u.UUID.String())
	accessCookie, refreshCookie := util.GetAuthCookies(accessToken, refreshToken)
	c.Cookie(accessCookie)
	c.Cookie(refreshCookie)

	/*return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})*/
	return c.Redirect("/", 301)
}

func GetUserData(c *fiber.Ctx) error {
	id := c.Locals("id")

	u := new(models.User)
	if res := db.DB.Where("uuid = ?", id).First(&u); res.RowsAffected <= 0 {
		return c.JSON(fiber.Map{"error": true, "general": "Cannot find the User"})
	}

	return c.JSON(u)
}

// GetAccessToken generates and sends a new access token iff there is a valid refresh token
func GetAccessToken(c *fiber.Ctx) error {
	refreshToken := c.Cookies("refresh_token")

	refreshClaims := new(models.Claims)
	token, _ := jwt.ParseWithClaims(refreshToken, refreshClaims,
		func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
	if res := db.DB.Where(
		"expires_at = ? AND issued_at = ? AND issuer = ?",
		refreshClaims.ExpiresAt, refreshClaims.IssuedAt, refreshClaims.Issuer,
	).First(&models.Claims{}); res.RowsAffected <= 0 {
		// no such refresh token exist in the database
		c.ClearCookie("access_token", "refresh_token")
		return c.SendStatus(fiber.StatusForbidden)
	}
	if token.Valid {
		if refreshClaims.ExpiresAt < time.Now().Unix() {
			// refresh token is expired
			c.ClearCookie("access_token", "refresh_token")
			return c.SendStatus(fiber.StatusForbidden)
		}
	} else {
		// malformed refresh token
		c.ClearCookie("access_token", "refresh_token")
		return c.SendStatus(fiber.StatusForbidden)
	}
	_, accessToken := util.GenerateAccessClaims(refreshClaims.Issuer)

	c.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   true,
	})

	return c.JSON(fiber.Map{"access_token": accessToken})

}

func LoginUser(c *fiber.Ctx) error {
	type LoginInput struct {
		Identity string `json:"identity"`
		Password string `json:"password"`
	}

	input := new(LoginInput)

	if err := c.BodyParser(input); err != nil {
		return c.JSON(fiber.Map{"error": true, "input": "Please review your input"})
	}
	// check if a user exists
	u := new(models.User)
	if res := db.DB.Where(
		&models.User{Email: input.Identity}).Or(
		&models.User{Username: input.Identity},
	).First(&u); res.RowsAffected <= 0 {
		return c.JSON(fiber.Map{"error": true, "general": "Invalid Credentials."})
	}

	// Comparing the password with the hash
	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(input.Password)); err != nil {
		return c.JSON(fiber.Map{"error": true, "general": "Invalid Credentials."})
	}
	// setting up the authorization cookies
	accessToken, refreshToken := util.GenerateTokens(u.UUID.String())
	accessCookie, refreshCookie := util.GetAuthCookies(accessToken, refreshToken)
	c.Cookie(accessCookie)
	c.Cookie(refreshCookie)

	/*return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})*/
	return c.Redirect("/api/user/private/user", 301)
}

//googleoauth functions
/*func Login(c *fiber.Ctx) error {
	googleConfig := config.ConfigSetup()
	url := googleConfig.AuthCodeURL("state")
	return c.Redirect(url, 301)
}

func Callback(c *fiber.Ctx) error {

	state := c.Query("state")
	if state != "state" {
		//fmt.Fprintln(res, "States Invalid")
		return c.SendString(("states Invalid"))
	}

	code := c.Query("code")
	googleConfig := config.ConfigSetup()
	token, err := googleConfig.Exchange(context.Background(), code)
	if err != nil {
		//fmt.Fprintln(res, "Code-Token Exchange Failed")
		return c.SendString(("Code-Token Exchange Failed"))
	}

	app := fiber.New()

	app.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token="+token.AccessToken, func(c *fiber.Ctx) error {

	})
	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		//fmt.Fprintln(res, "User Data fetch Failed")
		return c.SendString("User Data fetch Failed")
	}

	//userData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		//fmt.Fprintln(res, "User Data parsing Failed")
		return c.SendString("USER DATA PARSING FAILED")
	}

	fmt.Fprintln(res, string(userData))
}*/
