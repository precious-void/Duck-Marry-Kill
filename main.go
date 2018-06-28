package main

import (
	"fmt"
	"net/http"
	"time"

	database "./database"
	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2"
)

var dbSess, err = mgo.Dial(server)
var db = database.NewDBW(dbSess.DB("FDK"))

func main() {
	if err != nil {
		panic(err)
	}
	defer dbSess.Close()
	dbSess.SetMode(mgo.Monotonic, true)
	fmt.Println("Connected to db")

	router := mux.NewRouter()
	router.StrictSlash(true)
	router.HandleFunc("/", mainHandler)
	router.HandleFunc("/FDK", FDKHandler)
	router.HandleFunc("/FDKStats", FDKStatsHandler)
	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))))
	//router.NotFoundHandler = http.HandlerFunc(notFoundHandler)

	srv := http.Server{
		Addr:           port,
		Handler:        router,
		ReadTimeout:    5 * time.Second,
		WriteTimeout:   7 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	fmt.Println("Listenning to", port)
	err = srv.ListenAndServe()
	if err != nil {
		panic(err)
	}
}
