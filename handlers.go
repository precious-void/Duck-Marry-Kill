package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"

	"github.com/gorilla/sessions"
)

var (
	key   = []byte("EF495401D79526606BC45A351DED18E661333B2013451B06153C6CB8ACB88962")
	store *sessions.CookieStore
)

func init() {
	store = sessions.NewCookieStore(key)
	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400,
		HttpOnly: true, // TODO: delete this for https
	}
}

// MainHandler is for main page
func mainHandler(w http.ResponseWriter, r *http.Request) {
	err := template.Must(template.New("template").ParseGlob("templates/*")).ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		panic(err)
	}
}

// FDKHandler get and post actions from front
func FDKHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		men, err := dbwrap.GetRandomUsers(3, true)
		if err != nil {
			panic(err)
		}
		women, err := dbwrap.GetRandomUsers(3, false)
		if err != nil {
			panic(err)
		}
		s, err := json.Marshal(append(men, women...))
		if err != nil {
			panic(err)
		}
		fmt.Fprintf(w, string(s))
	}
}
