function fun(nameOfParagraph){
    if(document.getElementById(nameOfParagraph).style.display == "block"){
        document.getElementById(nameOfParagraph).style.display ="none";
    }
    else{
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