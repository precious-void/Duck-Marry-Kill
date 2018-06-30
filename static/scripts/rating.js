window.onload = function() {
    var radios = document.getElementsByClassName("radioRating");
    for(var i=0; i<radios.length; i++) {
        radios[i].onclick = function() {
            rating();
        }
    }

    if(getCookie("gender")==null) {
        setCookie("gender", "female", 7);
    }

    imgs = document.getElementsByClassName("imgRating");
    imgTexts = document.getElementsByClassName("imgRatingText");

    rating();
    switchGender(false);
    setTimeout("switchImg.style.opacity = 1;", 500);
    
}

// -------------------------------- Variables -------------------------------- //

var divsCreated = false;

var xhr = new XMLHttpRequest;
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
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
        switchImg.style.transform="rotate(0deg)";
    } else {
        switchImg.style.transform="rotate(180deg)";
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

function rating() {
    xhr.open("POST", "/api/users/rating", true);
    xhr.send(JSON.stringify({Sex: getCookie("gender"), Stat: document.querySelector('input[name="stat"]:checked').value}));
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