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
