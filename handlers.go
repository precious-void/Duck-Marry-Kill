package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

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
	if r.Method == "POST" {
		r.ParseForm()

		if vkid, ok := r.Form["vkid"]; ok {
			fmt.Println(vkid)
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
