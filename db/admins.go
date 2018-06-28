package db

import (
	"fmt"
	"math/rand"

	"gopkg.in/mgo.v2/bson"
)

// Admin is a great example of bad names
type Admin struct {
	UID     int  `bson:"uid" json:"uid"`
	IsAdmin bool `bson:"is_admin" json:"is_admin"`
}

// CreateUser cretes and returns a new user
func (dbw *Wrapper) CreateUser() Admin {
	uid, _ := dbw.Admins.Count()

	user := Admin{
		UID:     uid,
		IsAdmin: false,
	}

	dbw.Admins.Insert(user)

	return user
}

// IsUserAdmin tells if user has admin privelegies
func (dbw *Wrapper) IsUserAdmin(uid int) (bool, error) {
	var usr Admin
	err := dbw.Admins.Find(bson.M{"uid": uid}).One(&usr)

	return usr.IsAdmin, err
}

// GiveAdminPrivs gives admin priveleges to user with given ID
func (dbw *Wrapper) GiveAdminPrivs(userID int, keyVal string) (err error) {
	var key Key

	if dbw.Keys.Find(bson.M{"value": keyVal}).One(&key); key.CleatorID == userID {
		return nil
	}

	if valid, err := dbw.CheckKeyValidity(keyVal); valid {
		err = dbw.Admins.Update(bson.M{"uid": userID}, bson.M{"$set": bson.M{"is_admin": true}})

		return err
	}

	return &permissionError{}
}

// Key identified by value
type Key struct {
	CleatorID int    `bson:"creator_id" json:"creator_id"`
	Value     string `bson:"value" json:"value"`
}

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func randStringRunes(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

type permissionError struct {
}

func (e *permissionError) Error() string {
	return fmt.Sprintf("Permission denied")
}

// GenerateKey creates and return a random key
func (dbw *Wrapper) GenerateKey(providerID int) (key Key, err error) {
	if is, err := dbw.IsUserAdmin(providerID); is {
		key = Key{providerID, randStringRunes(6)}

		dbw.Keys.Insert(key)

		return key, err
	}

	return key, &permissionError{}
}

// GetUsersKeys returns all the keys created by user
func (dbw *Wrapper) GetUsersKeys(creatorID int) (keys []Key, err error) {
	err = dbw.Keys.Find(bson.M{
		"creator_id": creatorID,
	}).All(&keys)

	return keys, err
}

// CheckKeyValidity tells if key with given value exists
func (dbw *Wrapper) CheckKeyValidity(val string) (status bool, err error) {
	if cnt, _ := dbw.Keys.Find(bson.M{"value": val}).Count(); cnt > 0 {
		err = dbw.Keys.Remove(bson.M{"value": val})

		return true, err
	}

	return false, err
}
