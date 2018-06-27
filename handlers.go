package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"strconv"
	"strings"

	dbw "./db"
)

// GetUser get girl from vk by screenname
func GetUser(screenname string) (user dbw.User, err error) {
	cmd := exec.Command("python3", append([]string{SCRIPTS_PATH + "get_girl_by_vkid.py"}, screenname)...)
	bytes, err := cmd.Output()

	if err == nil {
		err = json.Unmarshal(bytes, &user)
	}

	return user, err
}

func RandomUserHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	//fmt.Print(r.Form)

	if sex, ok := r.Form["sex"]; ok {
		val, err := strconv.ParseBool(sex[0])

		if err == nil {
			users, _ := dbwrap.GetRandomUsers(3, val)
			b, _ := json.Marshal(users)

			fmt.Fprintln(w, string(b))
		}
	}
}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		r.ParseForm()
		// TODO: add admin checking

		if vkid, ok := r.Form["vkid"]; ok {
			val, err := strconv.Atoi(vkid[0])

			if err == nil {
				dbwrap.DeleteUser(val)
			}
		}
	}
}

func AddUserHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		r.ParseForm()

		if url, ok := r.Form["url"]; ok {
			pieces := strings.Split(url[0], "/")
			scname := pieces[len(pieces)-1]

			user, err := GetUser(scname)

			if err == nil {
				dbwrap.AddUser(user)
			} else {
				log.Println(err)
			}
		}

	}
}

func UpdateUserStatsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		r.ParseForm()

		if vkids, ok := r.Form["vkid"]; ok {
			if len(vkids) == 3 {
				var users []int

				for _, user := range vkids {
					vkid, err := strconv.Atoi(user)

					if err == nil {
						users = append(users, vkid)
					}
				}
				dbwrap.UpdateUserStats(users)
			}
		}
	}
}
