package db

import (
	"fmt"

	"gopkg.in/mgo.v2/bson"
)

// Stats - user statistics
type Stats struct {
	Kills  int `bson:"kills" json:"kills"`
	Fucks  int `bson:"fucks" json:"fucks"`
	Marrys int `bson:"marrys" json:"marrys"`
}

// User - basically stores user information
type User struct {
	VKId     int    `bson:"vkid" json:"vkid"` // used to identify users in database
	Name     string `bson:"name" json:"name"`
	Sex      bool   `bson:"sex" json:"sex"` // 0 - female, 1 - male
	PhotoURL string `bson:"photo_url" json:"photo_url"`
	Stats    Stats  `bson:"stats" json:"stats"`
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
func (dbw *Wrapper) AddUser(user User) (err error) {
	if n, _ := dbw.Users.Find(user).Count(); n == 0 {
		err = dbw.Users.Insert(user)
	}
	return err
}

// DeleteUser deletes a user with given vkid
func (dbw *Wrapper) DeleteUser(vkid int) error {
	return dbw.Users.Remove(bson.M{"vkid": vkid})
}

// GetRandomUsers samples {size} users with given sex from database
func (dbw *Wrapper) GetRandomUsers(size int, sex bool) (users []User, err error) {
	pipe := dbw.Users.Pipe([]bson.M{{"$match": bson.M{"sex": sex}}, {"$sample": bson.M{"size": size}}})
	err = pipe.All(&users)
	fmt.Println()

	return users, err
}

func (dbw *Wrapper) UpdateUserStats(vkids []int) {
	dbw.Users.Update(bson.M{"vkid": vkids[0]}, bson.M{"$inc": bson.M{"stats.fucks": 1}})
	dbw.Users.Update(bson.M{"vkid": vkids[1]}, bson.M{"$inc": bson.M{"stats.marrys": 1}})
	dbw.Users.Update(bson.M{"vkid": vkids[2]}, bson.M{"$inc": bson.M{"stats.kills": 1}})
}
