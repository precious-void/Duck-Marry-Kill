window.onload = function() {
    ResetSexSwitch();
    if(getCookie("_fbYshmsWE0iF73tD")==null){
        $.when(newUser()).done(
            function (sess) {
                console.log(`Creating new user uid=${sess.uid}`);
                setCookie("uid", sess.uid, 30);
            }
        )
    }
    InitNewGame();
}

function setSex() {
    var gender = getCookie("gender")
    setCookie("gender", (gender == "male" ? "female" : "male"))
    ResetSexSwitch()
    InitNewGame()
}

function ResetGame() {
    // Reinit constants
    $(".progress").hide();
    $(".determinate").css("width", "0%");
    $(".question p").html('Who would you <span class="fuck-span">fuck</span>?');

    window.actions = ["fuck", "marry", "kill"]
    window.choises = []

    var img = ["#photo_1", "#photo_2", "#photo_3"], i = 0;

    for (i = 0; i < 3; i++){
        img_sel = img[i];
        $(img[i]).removeClass();
        $(img[i]).addClass("card blue-grey darken-1 hoverable");
        $(img[i] + " .card-title").html(window.users[i]["name"]);
        $(img[i]).attr("onclick", `ApplyAction(${i})`);

    }
    // Array.prototype.forEach.call(imgButtons, imgButton => {
    //     imgTexts[j++].innerHTML = `<a href="https://vk.com/id${imgButton.user.vkid}" target=_blank>${imgButton.user.name}</a>`
    // });
    
    $(".question span").html(`${window.actions[0]}`);
    $(".question span").removeClass();
    $(".question span").addClass("fuck-span");
}

function InitNewGame() {
    $(".question p").html('Who would you <span class="fuck-span">fuck</span>?');

    window.actions = ["fuck", "marry", "kill"];
    window.choises = []

    $(".question span").html(`${window.actions[0]}`);
    $(".question span").removeClass();
    $(".question span").addClass("fuck-span");

    var sex = getCookie("gender")== "male" ? true : false;
    $.when(getRandomUsers(sex)).done(function(users){

        window.users = users;
        var img = ["#photo_1", "#photo_2", "#photo_3"], i = 0;

        for (i = 0; i < 3; i++){
            img_sel = img[i];
            $(img[i]).removeClass();
            $(img[i]).addClass("card blue-grey darken-1 hoverable");
            $(img[i] + " .card-title").html(window.users[i]["name"]);
            $(img[i] + " .card-image").css("background-image", `url(${window.users[i]["photo_url"]})`);
            $(img[i]).attr("onclick", `ApplyAction(${i})`);
        }
        
    })
}

function percentAgree(stats, action) {
    return Math.floor(stats[action] / (stats["fucks"] + stats["marrys"] + stats["kills"])*100)
}

function ApplyAction(id) {
    if (window.actions.length > 0) {
        
        var name = window.users[id].name;
        var act = window.actions.shift();
        var users_agree = percentAgree(window.users[id].stats, act + "s")
        var agree_string = users_agree ? `<br> <span>${users_agree}% of users agree with you.</span>`:``
        
        $(`#photo_${id + 1} .card-title`).html(`${name} ${agree_string}`);
        $(`#photo_${id + 1}`).addClass(act);

        window.choises.push(window.users[id].vkid)

        if (actions.length > 0) {

            $(".question span").html(`${window.actions[0]}`);
            $(".question span").removeClass();
            $(".question span").addClass(`${window.actions[0]}-span`);

        } else {
            $(".question p").html('Well done!');
            $(".progress").show();
            $(".determinate").css("width", "100%");

            setTimeout(EndGame, 3000);
        }
    }
    else{ResetGame();}
}

function EndGame() {
    if (window.choises.length == 3) {
        $(".determinate").css("width", "0%");
        $(".progress").hide();
        updateUserStats(window.choises)
        InitNewGame();
    }
}

function ResetSexSwitch() {
    if(getCookie("gender")==null) {
        setCookie("gender", "female", 7);
    }

    if(getCookie("gender") == "male") {
        $(".nav-wrapper > .ham > i").css("color", "blue");
        $("#nav-mobile > li:last-child i").css("color", "blue");

    } else {
        $(".nav-wrapper > .ham > i").css("color", "red");
        $("#nav-mobile > li:last-child i").css("color", "red");
    }
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

