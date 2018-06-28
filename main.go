package main

import (
	"net/http"

	db "./db"
	"gopkg.in/mgo.v2"
)

var (
	session, _ = mgo.Dial("localhost:27017")
	dbwrap     = db.NewDBW(session.DB("fmk"))
)

func main() {
	http.HandleFunc("/api/users/get", RandomUserHandler)
	http.HandleFunc("/api/users/add", AddUserHandler)
	http.HandleFunc("/api/users/update_stats", UpdateUserStatsHandler)

	http.HandleFunc("/api/keys/generate", GenerateKeyHandler)
	http.HandleFunc("/api/keys/get", GetUsersKeysHandler)
	http.HandleFunc("/api/keys/check", CheckKeyHandler)

	http.HandleFunc("/api/admins/create", CreateAdminHandler)
	http.HandleFunc("/api/admins/is_admin", CheckAdminHandler)
	http.HandleFunc("/api/admins/give", GiveAdminHandler)

	http.ListenAndServe(":9999", nil)
}
