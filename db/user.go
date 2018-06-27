package db

import (
	"fmt"

	"gopkg.in/mgo.v2/bson"
)

// Stats - user statistics
type Stats struct {
	Kills  int `bson:"kills"`
	Fucks  int `bson:"fucks"`
	Marrys int `bson:"marrys"`
}

// User - basically stores user information
type User struct {
	VKId     int    `bson:vkid` // used to identify users in database
	Name     string `bson:"name"`
	Sex      bool   `bson:"sex"`
	PhotoURL string `bson:"photo_urls"`
	Stats    Stats  `bson:"stats"`
}

type notEnoughPicsError struct {
	sliceLen int
	yourLen  int
}

func (e *notEnoughPicsError) Error() string {
	return fmt.Sprintf("%d bigger than %d", e.yourLen, e.sliceLen)
}

// AddUser adds user to database
// TODO: more comfortable adding
func (dbw *DBW) AddUser(user User) error {
	err := dbw.Users.Insert(user)
	return err
}

// DeleteUser deletes a user with given vkid
func (dbw *DBW) DeleteUser(vkid int) error {
	return dbw.Users.Remove(bson.M{"vkid": vkid})
}

// GetRandomUsers samples {size} users with given sex from database
func (dbw *DBW) GetRandomUsers(size int, sex bool) (users []User, err error) {
	pipe := dbw.Users.Pipe([]bson.M{{"$match": bson.M{"sex": sex}}, {"$sample": bson.M{"size": size}}})
	err = pipe.All(&users)

	return users, err
}
