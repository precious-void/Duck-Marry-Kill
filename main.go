package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2"

	db "./db"
)

var (
	info, _     = mgo.ParseURL(DBURI)
	sess, dberr = mgo.DialWithInfo(info)
	dbase       = sess.DB(DBNAME)
	dbwrap      = db.NewDBW(dbase)
)

func main() {
	if dberr != nil {
		panic(dberr)
	}
	defer sess.Close()
	sess.SetMode(mgo.Monotonic, true)
	fmt.Println("Connected to db")

	router := mux.NewRouter()
	router.StrictSlash(true)

	//---------------- setup api ----------------
	router.HandleFunc("/api/users/get", RandomUserHandler)
	router.HandleFunc("/api/users/add", AddUserHandler)
	router.HandleFunc("/api/users/update_stats", UpdateUserStatsHandler)

	router.HandleFunc("/api/keys/generate", GenerateKeyHandler)
	router.HandleFunc("/api/keys/get", GetUsersKeysHandler)
	router.HandleFunc("/api/keys/check", CheckKeyHandler)

	router.HandleFunc("/api/admins/create", CreateAdminHandler)
	router.HandleFunc("/api/admins/is_admin", CheckAdminHandler)
	router.HandleFunc("/api/admins/give", GiveAdminHandler)

	//---------------- setup service ------------
	router.HandleFunc("/", mainHandler)
	router.HandleFunc("/FDK", FDKHandler)
	router.HandleFunc("/FDKStats", FDKStatsHandler)
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))

	srv := http.Server{
		Addr:           port,
		Handler:        router,
		ReadTimeout:    5 * time.Second,
		WriteTimeout:   7 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	fmt.Println("Listenning to", port)

	err := srv.ListenAndServe()
	if err != nil {
		panic(err)
	}
}
