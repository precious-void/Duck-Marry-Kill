package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"strconv"

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
	session, err := store.Get(r, "FDK")
	if err != nil {
		panic(err)
	}

	err = template.Must(template.New("template").ParseGlob("templates/*")).ExecuteTemplate(w, "index.html", session)
	if err != nil {
		panic(err)
	}
}

// Data for json from front
type Data struct {
	Ids []string
}

// FDKHandler makes everything work
func FDKHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		men, err := db.GetRandomUsers(3, true)
		if err != nil {
			panic(err)
		}
		women, err := db.GetRandomUsers(3, false)
		if err != nil {
			panic(err)
		}
		s, err := json.Marshal(append(men, women...))
		if err != nil {
			panic(err)
		}
		fmt.Fprintf(w, string(s))
	} else {
		var d Data
		err := json.NewDecoder(r.Body).Decode(&d)
		if err != nil {
			panic(err)
		}
		var ids = []int{}

		for _, i := range d.Ids {
			j, _ := strconv.Atoi(i)
			ids = append(ids, j)
		}
		db.UpdateUserStats(ids)
	}
}
