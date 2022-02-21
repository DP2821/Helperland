// Enable button when prev task complete
// document.getElementById("pill-yourDetails-tab").disabled = false;
for(var i = 1; i<=3;i++){
    document.getElementById("some-faqs").innerHTML +=
    "<img style=\"transform: rotate(-90deg); cursor: pointer;\" class=\"down-arrow\" id=\"img"+ i +"\" src=\"./assets/images/keyboard-right-arrow-button.png\"" +
        "onclick=\"fun('p"+ i +"','img"+ i +"')\">" +
    "<p1 style=\"font-weight: bold;\">" +
        " Lorem ipsum dolor sit amet consectetur?" +
    "</p1>" +
    "<div class=\"detail\">" +
        "<p id=\"p"+ i +"\">" +
            "Lorem ipsum dolor sit amet consectetur adipisicing" +
        "</p>" +
    "</div><hr/>"
}

function fun(nameOfParagraph,img){
    if(document.getElementById(nameOfParagraph).style.display == "block"){
        document.getElementById(img).style.transform = "rotate(-90deg)";
        document.getElementById(nameOfParagraph).style.display ="none";
    }
    else{
        if(sessionStorage.getItem("openedParagraph") != null)
            document.getElementById(sessionStorage.getItem("openedParagraph")).style.display = "none";
        if(sessionStorage.getItem("opendImg"))
            document.getElementById(sessionStorage.getItem("opendImg")).style.transform = "rotate(-90deg)";
        document.getElementById(img).style.transform = "rotate(0deg)";

        sessionStorage.setItem("openedParagraph",nameOfParagraph);
        sessionStorage.setItem("opendImg",img);
        document.getElementById(nameOfParagraph).style.display ="block";
    }
}

$("#btn-add-new-address").click(function(){
    document.getElementById("add-new-address-div").style.display = "block";
    document.getElementById("btn-add-new-address").style.display = "none";
});
document.getElementById("date-Book-Service").min = "2022-02-12"