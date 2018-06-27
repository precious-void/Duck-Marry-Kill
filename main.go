package main

import (
	"fmt"

	dbw "./db"
	"gopkg.in/mgo.v2"
)

func main() {
	session, err := mgo.Dial("localhost:27017")
	if err != nil {
		panic(err)
	}
	defer session.Close()

	database := session.DB("fmk")
	dbwrap := dbw.NewDBW(database)

	fmt.Println(dbwrap.GetRandomUsers(3, true))
}
