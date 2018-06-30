window.onload = function() {
    if(getCookie("gender")==null) {
        setCookie("gender", "female", 7);
    }

    if(getCookie("_fbYshmsWE0iF73tD")==null){
        $.when(newUser()).done(
            function (sess) {
                console.log(`Creating new user uid=${sess.uid}`);
                setCookie("uid", sess.uid, 30);
            }
        )
    }

    switchImg.style.opacity = 1;
    rotate(false);
    FDK(true);
}

// -------------------------------- Variables -------------------------------- //

var imgButton1 = document.getElementById("imgButton1"),
    imgButton2 = document.getElementById("imgButton2"),
    imgButton3 = document.getElementById("imgButton3"),
    imgButtons = [imgButton1, imgButton2, imgButton3];    

var text     = document.getElementById("text"),
    imgTexts = document.getElementsByClassName("imgText");

var switchImg = document.getElementById("switchImg"), 
    gender    = document.cookie["gender"],
    words     = ["fuck", "marry", "kill"], 
    chosen    = [];

var xhr = new XMLHttpRequest();
var arr = [];
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        arr = JSON.parse(this.responseText);
        setGenderImg(arr);
    }
};


/* -------------------------------- FDK -------------------------------- */

var i = 0;
function FDK(update) {
    if(update) {
        xhr.open("GET", "/FDK", true);
        xhr.send();
    }
    text.innerHTML= `Choose whom you'd like to <span style="color:${i==0?"red":i==1?"orange":"green"}">` + words[0];
    imgButtons.forEach(imgButton => {
        imgButton.onclick = function() {
            this.disabled = true;
            this.classList.add(words[i]);
            chosen.push(this.childNodes[0].id);

            var j = parseInt(this.id.slice(-1)[0])-1;
            var name = imgTexts[j].innerText;
            imgTexts.item(j).innerHTML = `You chose to <span style="color:${i==0?"red":i==1?"orange":"green"}">` + words[i] + "</span> " + name;

            if(++i==3) {
                text.innerText = "Well done!";
                setTimeout(sendFDK, 2000);
            } else {
                text.innerHTML= `Choose whom you'd like to <span style="color:${i==0?"red":i==1?"orange":"green"}">` + words[i];
            }
        };
    });
}

function sendFDK() {
    if(i==3) {
        xhr.open("POST", "/api/users/update_stats");
        xhr.send(JSON.stringify({Ids: chosen}));
        resetFDK(true);
    }
}

function resetFDK(update) {
    var j = 0;
    imgButtons.forEach(imgButton => {
        imgButton.className = "imgButton";
        imgButton.disabled = false;
        var str = imgTexts[j].innerText.split(" "), len = str.length;
        imgTexts[j++].innerText = str[len-2] + ' ' + str[len-1];
    });
    i = 0;
    chosen = [];
    FDK(update)
}

/* ------------------------------ Functions ------------------------------ */

function setGenderImg(data) {
    var k = (getCookie("gender")=="male"?0:3);
    for(var i=k; i<k+3; i++) {
        var img = imgButtons[i-k].childNodes[0];
        img.src = data[i]["photo_url"];
        img.id = data[i]["vkid"];
        imgTexts.item(i-k).innerText = data[i]["name"];
    }
}

function rotate(b) {
    if(b) {
        var gender = getCookie("gender");
        setCookie("gender", (gender=="male"?"female":"male"), 7);
        setGenderImg(arr);
        resetFDK(false);
    }
    if(getCookie("gender") == "male") {
        switchImg.style.transform="rotate(0deg)";
    } else {
        switchImg.style.transform="rotate(180deg)";
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