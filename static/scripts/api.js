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
