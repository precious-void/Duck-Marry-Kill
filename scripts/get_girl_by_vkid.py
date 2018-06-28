#!/bin/python3

import vk
import json
import argparse

from config import APP_ID, USER_ID, PASSWORD

sess = vk.AuthSession(APP_ID, USER_ID, PASSWORD)
api = vk.API(sess)


def get_girl_by_vk_screenname(screenname):
    response = api.users.get(
                         user_ids=screenname,
                         fields=["photo_max_orig"],
                         version="5.73")[-1]

    out = dict()
    out["name"] = response["first_name"] + " " + response["last_name"]
    out["photo_url"] = response["photo_max_orig"]
    out["vkid"] = response["uid"]

    return json.dumps(out)    


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("vkid", help="Vkontakte Id, integer")
    args = parser.parse_args()

    print(get_girl_by_vk_screenname(str(args.vkid)))
