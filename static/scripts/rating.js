

window.onload = function() {
    
    // var radios = document.getElementsByClassName("radioRating");

    var pole = ["fuck", "marry", "kill"];
    for(var i=0; i< 3; i++) {
        rating(pole[i]);
    }
    if(getCookie("gender")==null) {
        setCookie("gender", "female", 7);
    }
    // imgs = document.getElementsByClassName("imgRating");
    // imgTexts = document.getElementsByClassName("imgRatingText");
    switchGender(false);
    // setTimeout("switchImg.style.opacity = 1;", 500);
}

// -------------------------------- Variables -------------------------------- //

var divsCreated = false;

var xhr = new XMLHttpRequest;
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

        var data = JSON.parse(this.responseText);
        
        console.log(data);

        if(!divsCreated) {
            createDivs(data.length);
            divsCreated = true;
        }
        for(var i=0; i<data.length; i++) {
            imgs.item(i).src = data[i]["photo_url"];
            imgTexts.item(i).innerText = data[i]["name"];
        }
    }
};

var ratingWrapper = document.getElementById("ratingWrapper");

/* ------------------------------ Functions ------------------------------ */

var imgs;

function switchGender(b) {
    if(b) {
        var gender = getCookie("gender");
        setCookie("gender", (gender=="male"?"female":"male"), 7);
        rating();
    }
    if(getCookie("gender") == "male") {
        $(".nav-wrapper > .ham > i").css("color", "blue");
        $("#nav-mobile > li:last-child i").css("color", "blue");

    } else {
        $(".nav-wrapper > .ham > i").css("color", "red");
        $("#nav-mobile > li:last-child i").css("color", "red");
    }
}

function createDivs(size) {
    for(var i=0; i<size; i++) {
        div = document.createElement("div");
        div.className = "imgRatingWrapper";
        img = document.createElement("img");
        img.className = "imgRating";
        text = document.createElement("div");
        text.className = "imgRatingText";
        ratingWrapper.appendChild(div);
        div.appendChild(img);
        div.appendChild(text);
    }
    
}

/* ------------------------------ Rating ------------------------------ */

function rating(action) {
    return $.ajax
    ({
        type: "POST",
        url: '/api/users/rating',
        dataType: 'json',
        async: true,
        data: {Sex: getCookie("gender"), Stat: action},
        success: function (data) {
            console.log(data);
            return data;
        },
        error: function() {
            return null;
        }
    })
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