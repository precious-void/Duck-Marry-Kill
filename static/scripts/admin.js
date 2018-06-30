window.onload = function() {
    OnGetKeys()
}

function OnSearch() {
    var username = document.getElementById("username").value;
    var user = getUserByName(username);

    $.when(user).done(
        function(user){
            window.location.replace(`/edit/${user.vkid}`)
            console.log("trying")
        }
    )
    console.log("failed miserably")    
}

function OnAddUser() {
    var url = document.getElementById("vk_url").value;
    addUser(url);
    document.getElementById("vk_url").value = ""
}

function OnBecomeAdmin() {
    var invite_key = document.getElementById("invite_key").value;
    $.when(becomeAdmin(invite_key)).done(function(data){
        alert("You gained admin permissions");
        location.reload(true)
    }
    )
}

function createKeyElement(value) {
    var div = document.createElement('div', {class: "key"});
    div.classList.add("key")
    div.innerHTML = value.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes
    return div; 
  }

function OnGenerateNewKey(){
    $.when(generateInviteKey()).done(function(key){
        var keyset = document.getElementById("invite_keys")
        keyset.appendChild(createKeyElement(key.value))
    }
    )
}

function OnGetKeys() {
    $.when(getSessInviteKeys()).done(function(keys){
        var keyset = document.getElementById("invite_keys")

        keys.forEach(key => {
            
            keyset.appendChild(createKeyElement(key.value))
        });
    }
    )
}




/* ------------------------------ Cookies ------------------------------ */

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}