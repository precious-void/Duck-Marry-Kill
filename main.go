package main

import (
	"net/http"

	dbw "./db"
	"gopkg.in/mgo.v2"
)

var (
	session, _ = mgo.Dial("localhost:27017")
	dbwrap     = dbw.NewDBW(session.DB("fmk"))
)

func main() {
	http.HandleFunc("/api/users/get", RandomUserHandler)
	http.HandleFunc("/api/users/add", AddUserHandler)
	http.HandleFunc("/api/users/stats", UpdateUserStatsHandler)

	http.ListenAndServe(":9999", nil)
}
