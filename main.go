package main

import (
	/*"context"
	"fmt"
	"io/ioutil"
	"net/http"*/

	"github.com/gofiber/fiber/v2"
	"github.com/task/config"
	"github.com/task/database"
	"github.com/task/router"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	googleOauthConfig = &oauth2.Config{
		RedirectURL:  "http://localhost:3000/api/oauth2/callback",
		ClientID:     config.Config("Client_ID"),
		ClientSecret: config.Config("Client_Secret"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}
	randomState = "random"
)

func main() {

	app := fiber.New()

	database.ConnectDB()

	router.SetupRoutes(app)

	app.Static("/", "./fend/root")
	app.Static("/api/user/private/user", "./fend/private")
	//http.HandleFunc("/google/login", Login)
	//http.HandleFunc("/api/oauth2/callback", Callback)

	// Listen on PORT 3000
	app.Listen(":3000")
	//http.ListenAndServe(":3000", nil)

}

/*func Login(res http.ResponseWriter, req *http.Request) {
	googleConfig := config.ConfigSetup()
	url := googleConfig.AuthCodeURL("state")
	http.Redirect(res, req, url, http.StatusSeeOther)
}
func Callback(res http.ResponseWriter, req *http.Request) {
	state := req.URL.Query()["state"][0]
	if state != "state" {
		fmt.Fprintln(res, "States Invalid")
		return
	}

	code := req.URL.Query()["code"][0]
	googleConfig := config.ConfigSetup()
	token, err := googleConfig.Exchange(context.Background(), code)
	if err != nil {
		fmt.Fprintln(res, "Code-Token Exchange Failed")
		return
	}

	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		fmt.Fprintln(res, "User Data fetch Failed")
		return
	}

	userData, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Fprintln(res, "User Data parsing Failed")
		return
	}

	fmt.Fprintln(res, string(userData))
}*/
