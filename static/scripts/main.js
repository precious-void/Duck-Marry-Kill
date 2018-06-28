window.onload = function() {
    switchImg.style.opacity = 1;
    rotate();
    FDK();
}

var gender = (((window.location.href).indexOf("gender=true")!=-1)?1:-1),
    switchImg = document.getElementById("switchImg");

function rotate() {
    if(gender == 1) {
        switchImg.style.transform="rotate(0deg)";
        document.getElementById("nav").style.backgroundColor = "lightblue";
    } else {
        switchImg.style.transform="rotate(180deg)";
        document.getElementById("nav").style.backgroundColor = "pink";
    }
    gender *= -1; 
}

// -------------------------------- FDK -------------------------------- //

var imgWrapper1 = document.getElementById("imgWrapper1"),
    imgWrapper2 = document.getElementById("imgWrapper2"),
    imgWrapper3 = document.getElementById("imgWrapper3"),
    imgWrappers = [imgWrapper1, imgWrapper2, imgWrapper3];    

var text = document.getElementById("text"),
    imgTexts = document.getElementsByClassName("imgText");

var words = ["fuck", "marry", "kill"], chosen = [];

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var arr = JSON.parse(this.responseText);
        for(var i=0; i<3; i++) {
            var img = imgWrappers[i].childNodes[0];
            img.src = arr[i]["photo_url"];
            img.id = arr[i]["vkid"];
            imgTexts[i].innerText = arr[i]["name"];
        }
    }
};

var i = 0;
function FDK() {
    xhr.open("GET", "/FDK", false);
    xhr.send();
    text.innerText = "Choose whom you'd " + words[0];
    imgWrappers.forEach(imgWrapper => {
        imgWrapper.onclick = function() {
            var name = imgTexts[i].innerText;
            chosen.push(this.childNodes[0].id);
            console.log(chosen);
            this.classList.add(words[i]);
            this.disabled = true;
            imgTexts[parseInt(this.id.slice(-1)[0])-1].innerText = "You chose to " + words[i] + " " + name;
            if(++i==3) {
                text.innerText = "Well done!";
                setTimeout(sendFDK, 2000);
            } else {
                text.innerText = "Choose whom you'd like to " + words[i];
            }
        };
    });
}

function sendFDK() {
    if(i==3) {
        xhr.open("POST", "/FDK");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(JSON.stringify({Ids: chosen}));
        resetFDK();
        FDK();
    }
}

function resetFDK() {
    var j = 0;
    imgWrappers.forEach(imgWrapper => {
        imgWrapper.className = "imgWrapper";
        imgWrapper.disabled = false;
        var str = imgTexts[j].innerText;
        imgTexts[j++].innerText = str.split(" ").slice(-1)[0];
    });
    i = 0;
    chosen = [];
}
