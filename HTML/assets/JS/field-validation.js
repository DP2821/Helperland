function validateForm() {

    var isValidForm = true;

    //--->fname validation<---
    isValidForm = isValidForm && fNameValidation();

    //--->lname validation<---
    isValidForm = isValidForm && lNameValidation();

    //--->Email validation<---
    isValidForm = isValidForm && emailValidation();

    // --->Mobilenumber Validation<---
    isValidForm = isValidForm && numberValidation();

    //--->Address Validation<---
    isValidForm = isValidForm && textAreaValidation();

    if(!isValidForm){
        alert("Enter valid details")
    }
    return isValidForm;
}


//FirstName Validation- only Alphabet
function fNameValidation() {

    var fname = document.getElementById("fName").value.split(" ").join("");

    if (fname.length < 1) {
        return false;
    }
    else {
        for (i = 0; i < fname.length; i++) {
            if (!((fname.charAt(i) >= 'a' && fname.charAt(i) <= 'z') || (fname.charAt(i) >= 'A' && fname.charAt(i) <= 'Z'))) {
                return false;
            }
        }
        return true;
    }
}

//LastName Validation- only Alphabet
function lNameValidation() {
    var lname = document.getElementById("lName").value.split(" ").join("");

    if (lname.length < 1) {
        return false;
    }
    else {
        for (i = 0; i < lname.length; i++) {
            if (!((lname.charAt(i) >= 'a' && lname.charAt(i) <= 'z') || (lname.charAt(i) >= 'A' && lname.charAt(i) <= 'Z'))) {
                return false;
            }
        }

        return true;
    }
}

//email validation- min required format [3]@[2].[2]
function emailValidation() {
    var email = document.getElementById("email").value;

    //Check minimum valid length of an Email and does @ exist or not.
    var isValidEmail = true;
    if (email.length <= 8 && email.indexOf("@") == -1) {
        return false;
    }
    else {
        var parts = email.split("@");
        var dot = parts[1].indexOf(".");
        var dotSplits = parts[1].split(".");
        var dotCount = dotSplits.length - 1;

        //Check whether Dot is present, and that too minimum 2 character after @.
        if (dot == -1 || dot < 2 || dotCount > 2 || parts[0].length < 3) {
            return false;
        }

        //Check whether Dot is not the last character and dots are not repeated in email
        for (var i = 0; i < dotSplits.length; i++) {
            if (dotSplits[i].length == 0) {
                return false;
            }
        }

        return true;
    }
}

// mobile nuumber validation - starts with 7,8,9 & length is 10
function numberValidation() {
    var number = document.getElementById("number").value;

    if (number.length != 10 || number.charAt(0) <= '5') {
        return false;
    }
    else {
        for (i = 1; i < number.length; i++) {
            if (!(number.charAt(i) >= '0' && number.charAt(i) <= '9')) {
                return false;
            }
        }
        return true;
    }
}


// to check length of address - max 250
function textAreaValidation(){
    var message = document.getElementById("message").value;

    if(message.length < 1 || message.length > 250){
        return false;
    }
    else{
        return true;
    }
}