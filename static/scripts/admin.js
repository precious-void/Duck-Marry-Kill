function OnSearch() {
    var username = document.getElementById("username").value   
    var user = getUserByName(username)

    $.when(user).done(
        function(user){
            window.location.replace(`/edit/${user.vkid}`)
        }
    )
}