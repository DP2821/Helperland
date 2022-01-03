function fun(nameOfParagraph,img){
    if(document.getElementById(nameOfParagraph).style.display == "block"){
        document.getElementById(img).style.transform = "rotate(360deg)";
        document.getElementById(nameOfParagraph).style.display ="none";
    }
    else{
        if(sessionStorage.getItem("openedParagraph") != null)
            document.getElementById(sessionStorage.getItem("openedParagraph")).style.display = "none";
        if(sessionStorage.getItem("opendImg"))
            document.getElementById(sessionStorage.getItem("opendImg")).style.transform = "rotate(360deg)";
        document.getElementById(img).style.transform = "rotate(90deg)";

        sessionStorage.setItem("openedParagraph",nameOfParagraph);
        sessionStorage.setItem("opendImg",img);
        document.getElementById(nameOfParagraph).style.display ="block";
    }
}

function customerChangeColor(){
    if(document.getElementById("pills-home-tab").style.backgroundColor != "#1D7A8C"){
        document.getElementById("pills-home-tab").style.backgroundColor = "#1D7A8C";
        document.getElementById("pills-home-tab").style.color = "white"

        document.getElementById("pills-profile-tab").style.backgroundColor = "white";
        document.getElementById("pills-profile-tab").style.color = "black"
        
    }
}


function serviceChangeColor(){
    if(document.getElementById("pills-profile-tab").style.backgroundColor != "#1D7A8C"){
        document.getElementById("pills-profile-tab").style.backgroundColor = "#1D7A8C";
        document.getElementById("pills-profile-tab").style.color = "white"

        document.getElementById("pills-home-tab").style.backgroundColor = "white";
        document.getElementById("pills-home-tab").style.color = "black"
    }
}