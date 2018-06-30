package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"strconv"
	"strings"
)

// MainHandler is for main page
func mainHandler(w http.ResponseWriter, r *http.Request) {
	err := template.Must(template.New("template").ParseGlob("templates/*")).ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		panic(err)
	}
}

func editHandler(w http.ResponseWriter, r *http.Request) {
	parsed := strings.Split(r.URL.Path, "/")
	id, err := strconv.Atoi(parsed[len(parsed)-1])
	if err != nil {
		panic(err)
	}
	user, err := dbwrap.GetUserByVKID(id)
	if err != nil {
		panic(err)
	}
	err = template.Must(template.New("template").ParseGlob("templates/*")).ExecuteTemplate(w, "edit.html", user)
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

type adminPageStruct struct {
	IsAdmin bool
}

func adminHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		template.Must(
			template.New("template").
				ParseGlob("templates/*")).
			ExecuteTemplate(w, "addgirl.html", adminPageStruct{checkAdminCookie(r)})
	}
}

func ratingHandler(w http.ResponseWriter, r *http.Request) {
	err := template.Must(template.New("template").ParseGlob("templates/*")).ExecuteTemplate(w, "rating.html", nil)
	if err != nil {
		panic(err)
	}
}
