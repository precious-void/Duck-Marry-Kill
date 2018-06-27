var words = ["fuck", "marry", "kill"];
var img1 = document.getElementById("img1"),
    img2 = document.getElementById("img2"),
    img3 = document.getElementById("img3"),
    imgText = document.getElementsByClassName("imgText");
var imgs = [img1, img2, img3];

window.onload = function() {
    img1.className += " fucked";
    img2.className += " married";
    img3.className += " killed";

    /*var i = 0;
    imgs.forEach(e => {
        if(e.className.includes("fucked")) {
            imgText[i].innerHTML = "You chose to fuck it";
        }
        else if(e.className.includes("married")) {
            imgText[i].innerHTML = "You chose to marry it";
        }
        else if(e.className.includes("killed")) {
            imgText[i].innerHTML = "You chose to kill it";
        }
        i += 1;
    });*/

}