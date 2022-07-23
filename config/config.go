package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func Config(key string) string {

	err := godotenv.Load("task.env")
	if err != nil {
		fmt.Print("Error loading .env file")
	}

	return os.Getenv(key)
}

func ConfigSetup() *oauth2.Config {
	conf := &oauth2.Config{
		RedirectURL:  "http://localhost:3000/api/user/callback",
		ClientID:     Config("Client_ID"),
		ClientSecret: Config("Client_Secret"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}
	return conf

}
