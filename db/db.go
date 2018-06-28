package db

import (
	"math/rand"
	"time"

	"gopkg.in/mgo.v2"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

// Wrapper is a mongo database wrapper
type Wrapper struct {
	Users  *mgo.Collection
	Admins *mgo.Collection
	Keys   *mgo.Collection
}

// NewWrapper creates a DB instance
func NewWrapper(database *mgo.Database) *Wrapper {
	dbw := new(Wrapper)

	dbw.Users = database.C("users")
	dbw.Admins = database.C("admins")
	dbw.Keys = database.C("keys")

	return dbw
}
