for (var i = 1; i < 9; i++) {
    document.getElementById("pills-home").innerHTML += "<div class=\"forcustomer\">" +
        "<img class=\"dowm-arrow\" id=\"img" + i + "\" src=\"./assets/images/right-arrow-grey.png\"" +
        "onclick=\"fun('p" + i + "','img" + i + "')\">" +
        "<p1 style=\"font-weight: bold;\">" +
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus rem repudiandae adipisci mollitia?" +
        "</p1>" +
        "<div class=\"detail\">" +
        "<p id=\"p" + i + "\">" +
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti repellendus ratione excepturi rem sit, vitae dolore in nobis porro temporibus expedita officia quia cumque delectus." +
        "</p>" +
        "</div>" +
        "</div>"
}

for (var i = 9; i < 19; i++) {
    document.getElementById("pills-profile").innerHTML += "<div class=\"forserviceprovider\">" +
        "<img class=\"dowm-arrow\" id=\"img" + i + "\" src=\"./assets/images/right-arrow-grey.png\"" +
        "onclick=\"fun('p" + i + "','img" + i + "')\">" +
        "<p1 style=\"font-weight: bold;\">" +
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus rem repudiandae adipisci mollitia?" +
        "</p1>" +
        "<div class=\"detail\">" +
        "<p id=\"p" + i + "\">" +
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti repellendus ratione excepturi rem sit, vitae dolore in nobis porro temporibus expedita officia quia cumque delectus." +
        "</p>" +
        "</div>" +
        "</div>"
}

function fun(nameOfParagraph, img) {
    if (document.getElementById(nameOfParagraph).style.display == "block") {
        document.getElementById(img).style.transform = "rotate(360deg)";
        document.getElementById(nameOfParagraph).style.display = "none";
    }
    else {
        if (sessionStorage.getItem("openedParagraph") != null)
            document.getElementById(sessionStorage.getItem("openedParagraph")).style.display = "none";
        if (sessionStorage.getItem("opendImg"))
            document.getElementById(sessionStorage.getItem("opendImg")).style.transform = "rotate(360deg)";
        document.getElementById(img).style.transform = "rotate(90deg)";

        sessionStorage.setItem("openedParagraph", nameOfParagraph);
        sessionStorage.setItem("opendImg", img);
        document.getElementById(nameOfParagraph).style.display = "block";
    }
}

function customerChangeColor() {
    if (document.getElementById("pills-home-tab").style.backgroundColor != "#177b8d") {
        document.getElementById("pills-home-tab").style.backgroundColor = "#177b8d";
        document.getElementById("pills-home-tab").style.color = "white"

        document.getElementById("pills-profile-tab").style.backgroundColor = "white";
        document.getElementById("pills-profile-tab").style.color = "#646464"

    }
}


function serviceChangeColor() {
    if (document.getElementById("pills-profile-tab").style.backgroundColor != "#177b8d") {

        document.getElementById("pills-profile-tab").style.backgroundColor = "#177b8d";
        document.getElementById("pills-profile-tab").style.color = "white"

        document.getElementById("pills-home-tab").style.backgroundColor = "white";
        document.getElementById("pills-home-tab").style.color = "#646464"
    }
}