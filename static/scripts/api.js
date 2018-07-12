function getRandomUsers(sex) {
    return $.ajax
    ({
        type: "POST",
        url: '/api/users/get',
        dataType: 'json',
        async: false,
        data: JSON.stringify({sex: sex}),
        success: function (data) {
            return data;
        },
        error: function() {
            return null;
        }
    })
}

function updateUserStats(users) {
    return $.ajax
    ({
        type: "POST",
        url: "/api/users/update_stats",
        dataType: "json",
        async: true,
        data: JSON.stringify({vkids: users}),
        success: function (data) {
            return data
        },
        error: function() {
            return null
        }
    })
}

function getUserByName(name) {
    return $.ajax
    ({
        type: "POST",
        url: '/api/users/getby',
        dataType: 'json',
        async: true,
        data: JSON.stringify({ name: name}),
        success: function (data) {
            return data
        },
        error: function() {
            return null
        }
    })
}

function addUser(url) {
    return $.ajax
    ({
        type: "POST",
        url: '/api/users/add',
        dataType: 'json',
        async: true,
        data: JSON.stringify({ url: url}),
        success: function (data) {
            return data
        },
        error: function() {
            return null
        }
    })
}

function newUser() {
    return $.ajax
    ({
        type: "GET",
        url: '/api/admins/create',
        dataType: 'json',
        async: true,
        success: function (data) {
            return data
        },
        error: function() {
            return null
        }
    })
}

function generateInviteKey() {
    var uid = getCookie("uid")

    return $.ajax
    ({
        type: "POST",
        url: '/api/keys/generate',
        dataType: 'json',
        async: true,
        data: JSON.stringify({creator_id: uid}),
        success: function (data) {
            return data
        },
        error: function() {
            return null
        }
    })
}

function getSessInviteKeys() {
    var uid = getCookie("uid")

    return $.ajax
    ({
        type: "POST",
        url: '/api/keys/get',
        dataType: 'json',
        async: true,
        data: JSON.stringify({uid: uid}),
        success: function (data) {
            return data
        },
        error: function() {
            return null
        }
    })
}

function becomeAdmin(key) {
    var uid = getCookie("uid")

    return $.ajax
    ({
        type: "POST",
        url: '/api/admins/give',
        dataType: 'json',
        async: true,
        data: JSON.stringify({uid: uid, key: key}),
        success: function (data) {
            return data
        },
        error: function() {
            return null
        }
    })
}
