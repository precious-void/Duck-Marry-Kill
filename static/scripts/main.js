var imgButtons = document.getElementsByClassName("imgButton"),
    imgTexts   = document.getElementsByClassName("imgText")

var actions_html = ['<span style="color:red">fuck</span>', 
               '<span style="color:orange">marry</span>', 
               '<span style="color:green">kill</span>']
    actions = ["fuck", "marry", "kill"],
    choices = []

var text = document.getElementById("text"),
    switchImg = document.getElementById("switchImg")


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

switchImg.onclick = function() {
    var gender = getCookie("gender")
    setCookie("gender", (gender == "male" ? "female" : "male"))
    ResetSexSwitch()
    InitNewGame()
}


function ResetGame() {
    var j = 0;

    Array.prototype.forEach.call(imgButtons, imgButton => {
        imgButton.className = "imgButton";
        imgButton.disabled = false;
        //var str = imgTexts[j].innerText.split(" "), len = str.length;
        imgTexts[j++].innerHTML = `<a href="https://vk.com/id${imgButton.user.vkid}" target=_blank>${imgButton.user.name}</a>`
    });
    
    actions_html = ['<span style="color:red">fuck</span>',
               '<span style="color:orange">marry</span>', 
               '<span style="color:green">kill</span>']
    actions = ["fuck", "marry", "kill"]
    choices = []

    text.innerHTML = `Who would you ${actions_html[0]}?`    
}

function InitNewGame() {
    var sex = getCookie("gender")=="male"?true:false
    $.when(getRandomUsers(sex)).done(function(users){
        var i = 0;

        // initialize game
        Array.prototype.forEach.call(users, function(user) {
            imgTexts[i].innerHTML = user.name                
            imgButtons[i].children[0].setAttribute("src", user.photo_url)

            // base style
            imgButtons[i].className = "imgButton";
            imgButtons[i].disabled = false;

            // ids
            imgButtons[i].id_ = i
            imgButtons[i].user = user

            imgButtons[i++].onclick = function() {
                ApplyAction(this.id_, this.user)
                this.disabled = true            
            }
        });

        ResetGame();
    })
}

function percentAgree(stats, action) {
    return Math.floor(stats[action] / (stats["fucks"] + stats["marrys"] + stats["kills"])*100)
}

function ApplyAction(id, user) {
    if (actions.length > 0) {
        var name = imgTexts[id].innerHTML;

        var action_html = actions_html.shift()
        var action = actions.shift()

        var users_agree = percentAgree(user.stats, action+"s")
        var agree_string = users_agree?`<br> ${users_agree}% of users agre with you.`:``
        
        imgTexts[id].innerHTML = `You chose to ${action_html} ${name} ${agree_string}`
        imgButtons[id].classList.add(action)

        choices.push(user.vkid)

        if (actions.length > 0) {
            text.innerHTML = `Who would you ${actions_html[0]}?`
        } else {
            text.innerHTML = "Well done!"
            setTimeout(EndGame, 2000);
        }
    }
}

function EndGame() {
    if (choices.length == 3) {
        updateUserStats(choices)
        InitNewGame()
    }
}

function ResetSexSwitch() {
    if(getCookie("gender")==null) {
        setCookie("gender", "female", 7);
    }

    switchImg.style.opacity = 1;    
    setTimeout("switchImg.style.opacity = 1;", 500);

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

