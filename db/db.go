package db

import (
	"math/rand"
	"time"

	"gopkg.in/mgo.v2"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

// DBW is a mongo database wrapper
type DBW struct {
	Users *mgo.Collection
}

// NewDBW creates a DB instance
func NewDBW(database *mgo.Database) *DBW {
	dbw := new(DBW)

	dbw.Users = database.C("users")

	return dbw
}
