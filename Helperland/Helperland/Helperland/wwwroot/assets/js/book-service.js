for (var i = 1; i <= 3; i++) {
    document.getElementById("some-faqs").innerHTML +=
        "<img style=\"transform: rotate(-90deg); cursor: pointer;\" class=\"down-arrow\" id=\"img" + i + "\" src=\"/assets/images/keyboard-right-arrow-button.png\"" +
        "onclick=\"fun('p" + i + "','img" + i + "')\">" +
        "<p1 style=\"font-weight: bold;\">" +
        " Lorem ipsum dolor sit amet consectetur?" +
        "</p1>" +
        "<div class=\"detail\">" +
        "<p id=\"p" + i + "\">" +
        "Lorem ipsum dolor sit amet consectetur adipisicing" +
        "</p>" +
        "</div><hr/>"
}
function fun(nameOfParagraph, img) {
    if (document.getElementById(nameOfParagraph).style.display == "block") {
        document.getElementById(img).style.transform = "rotate(-90deg)";
        document.getElementById(nameOfParagraph).style.display = "none";
    }
    else {
        if (sessionStorage.getItem("openedParagraph") != null)
            document.getElementById(sessionStorage.getItem("openedParagraph")).style.display = "none";
        if (sessionStorage.getItem("opendImg"))
            document.getElementById(sessionStorage.getItem("opendImg")).style.transform = "rotate(-90deg)";
        document.getElementById(img).style.transform = "rotate(0deg)";

        sessionStorage.setItem("openedParagraph", nameOfParagraph);
        sessionStorage.setItem("opendImg", img);
        document.getElementById(nameOfParagraph).style.display = "block";
    }
}

$(document).ready(function () {
    /**
     * When page start or refresh, 
     * Reset Enabled tab-button, pinocde field and checkbox etc...
     */
    document.getElementById("pill-schedulePlan-tab").disabled = true;
    document.getElementById("pill-yourDetails-tab").disabled = true;
    document.getElementById("pill-payment-tab").disabled = true;
    document.getElementById("postalCode").value = "";
    document.getElementById("payment-complete-booking").disabled = false;
    $(".checkbox-extra-service").prop("checked", false);


    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("date-book-service").min = today;


    $("#form-pincode").submit(function (event) {
        event.preventDefault();
        checkZipCode();
    });

    $('#postalCode').change(function () {
        checkZipCode();
    });

    $("#pill-setupService-tab").click(function () {
        $("#pill-setupService-tab").addClass("service-tab-active");
        $("#pill-schedulePlan-tab").removeClass("service-tab-active");
        $("#pill-yourDetails-tab").removeClass("service-tab-active");
        $("#pill-payment-tab").removeClass("service-tab-active");

        $("#img-setup-service").addClass("setup-img-white");
        $("#img-schedule-plan").removeClass("setup-img-white");
        $("#img-user-details").removeClass("setup-img-white");
        $("#img-payment").removeClass("setup-img-white");

    });

    $("#pill-schedulePlan-tab").click(function () {
        $("#pill-setupService-tab").removeClass("service-tab-active");
        $("#pill-schedulePlan-tab").addClass("service-tab-active");
        $("#pill-yourDetails-tab").removeClass("service-tab-active");
        $("#pill-payment-tab").removeClass("service-tab-active");

        $("#img-setup-service").removeClass("setup-img-white");
        $("#img-schedule-plan").addClass("setup-img-white");
        $("#img-user-details").removeClass("setup-img-white");
        $("#img-payment").removeClass("setup-img-white");

        /*
        * When Second tab(Schedule & plan) opens update date time and payment info in the Payment summary
          card
        */
        $("#span-basic-hours").html($("#basic-stay-time").val());
        updateDateTime();
        updateTotalServiceTime();
        updateTotalPayment();
    });

    $("#pill-yourDetails-tab").click(function () {
        $("#pill-setupService-tab").removeClass("service-tab-active");
        $("#pill-schedulePlan-tab").removeClass("service-tab-active");
        $("#pill-yourDetails-tab").addClass("service-tab-active");
        $("#pill-payment-tab").removeClass("service-tab-active");

        $("#img-setup-service").removeClass("setup-img-white");
        $("#img-schedule-plan").removeClass("setup-img-white");
        $("#img-user-details").addClass("setup-img-white");
        $("#img-payment").removeClass("setup-img-white");
    });

    $("#pill-payment-tab").click(function () {
        $("#pill-setupService-tab").removeClass("service-tab-active");
        $("#pill-schedulePlan-tab").removeClass("service-tab-active");
        $("#pill-yourDetails-tab").removeClass("service-tab-active");
        $("#pill-payment-tab").addClass("service-tab-active");

        $("#img-setup-service").removeClass("setup-img-white");
        $("#img-schedule-plan").removeClass("setup-img-white");
        $("#img-user-details").removeClass("setup-img-white");
        $("#img-payment").addClass("setup-img-white");
    });

    $('#date-book-service').change(function () {
        updateDateTime();
    });

    $('#start-time-book-service').change(function () {
        updateDateTime();
    });

    $('#basic-stay-time').change(function () {
        //Adding basic hours to Payment summary card from dropdown
        $("#span-basic-hours").html($("#basic-stay-time").val());

        updateTotalServiceTime();
        updateTotalPayment();
    });

    $('.checkbox-extra-service').change(function () {
        /**
         * When to add Extra service title to Payment summary card
         */
        if ($('.checkbox-extra-service').filter(':checked').length < 1) {
            //If there is no extra service added remove Extra service title 
            document.getElementById("extras-title").innerHTML = "";
        }
        else {
            //If there is more than 1 extra service add Extra service title
            document.getElementById("extras-title").innerHTML = "<br>" + "Extras" + "<br>";
        }

        updateTotalServiceTime();
        updateTotalPayment();


        if ($(this).is(':checked')) {
            /**
             * Extra service blue border and blue image adding
             */
            $(this).parent().addClass('rounded-grey-box-active');
            $(this).siblings().addClass('img-extra-service-active');


            /**
             * Showing extra service span tag in the payment summary card
             */
            switch ($(this).val()) {
                case '1':
                    $("#span-inside-cabinet").addClass("display-inline-important");
                    break;
                case '2':
                    $("#span-inside-fridge").addClass("display-inline-important");
                    break;
                case '3':
                    $("#span-inside-oven").addClass("display-inline-important");
                    break;
                case '4':
                    $("#span-laundry-wash").addClass("display-inline-important");
                    break;
                case '5':
                    $("#span-interior-window").addClass("display-inline-important");
                    break;
            }
        }
        else {
            /**
             * Extra service blue border and blue image remove
             */
            $(this).parent().removeClass('rounded-grey-box-active');
            $(this).siblings().removeClass('img-extra-service-active');

            /**
             * Hiding extra service span tag in the payment summary card
             */
            switch ($(this).val()) {
                case '1':
                    $("#span-inside-cabinet").removeClass("display-inline-important");
                    break;
                case '2':
                    $("#span-inside-fridge").removeClass("display-inline-important");
                    break;
                case '3':
                    $("#span-inside-oven").removeClass("display-inline-important");
                    break;
                case '4':
                    $("#span-laundry-wash").removeClass("display-inline-important");
                    break;
                case '5':
                    $("#span-interior-window").removeClass("display-inline-important");
                    break;
            }
        }
    });

    $("#schedule-plan-btn-continue").click(function () {
        if (document.getElementById("date-book-service").value != "") {
            document.getElementById("pill-yourDetails-tab").disabled = false;
            document.getElementById("pill-yourDetails-tab").click();
        }
        else {
            document.getElementById("pill-yourDetails-tab").disabled = true;
            alert("Please select date...")
        }
    });

    $("#date-book-service").change(function () {
        if (document.getElementById("date-book-service").value != "") {
            document.getElementById("pill-yourDetails-tab").disabled = false;
        }
        else {
            document.getElementById("pill-yourDetails-tab").disabled = true;
        }
    });
    
    $("#btn-add-new-address").click(function () {
        $("#add-new-address-form-postal-code").val($("#postalCode").val());
        document.getElementById("add-new-address-div").style.display = "block";
        document.getElementById("btn-add-new-address").style.display = "none";
    });

    $("#add-new-address-btn-cancel").click(function () {
        document.getElementById("add-new-address-div").style.display = "none";
        document.getElementById("btn-add-new-address").style.display = "block";
    });

    $("#add-new-address-btn-save").click(function () {
        var streetName = $("#add-new-address-form-street-name").val();
        var houseNumber = $("#add-new-address-form-house-number").val();
        var postalCode = $("#add-new-address-form-postal-code").val();
        // var city = $("#add-new-address-form-city").val();
        var phone = $("#add-new-address-form-phone").val();

        if (streetName != "" && houseNumber != "" && city != "" && phone != "") {
            if (phone.length == 10) {
                if (!isNaN(phone)) {
                    var model = {
                        StreetName: streetName,
                        HouseNumber: houseNumber,
                        PostalCode: postalCode,
                        City: city,
                        Phone: phone
                    }

                    $.post("SaveUserAddress", model, function (data) {

                        if (parseInt(data) >= 1) {
                            document.getElementById("add-new-address-btn-cancel").click();
                            updateAddressList();
                        }
                        else {
                            alert("Something went wrong")
                        }
                    });
                }
                else {
                    alert("Phone number should be all digit");
                }

            }
            else {
                alert("Phone number should be 10 digit");
            }

        }
        else {
            alert("Please insert all fields");
        }


    });

    $("#your-details-continue").click(function () {

        var isAnyAddressSelected = false;
        var x = document.getElementsByName("address");
        for (var i = 0; i < x.length; i++) {
            if (x[i].checked == true) {
                isAnyAddressSelected = true;
                break;
            }
        }
        if (isAnyAddressSelected) {
            document.getElementById("pill-payment-tab").disabled = false;
            document.getElementById("pill-payment-tab").click();
        }
        else {
            document.getElementById("pill-payment-tab").disabled = true;
            alert('Please select address first!');
        }
    });

    $("#payment-complete-booking").click(function () {
        var pincode = $("#postalCode").val();
        var serviceStartDate = $("#date-book-service").val();
        var serviceStartTime = $("#start-time-book-service").val();
        var serviceBasicHours = $("#basic-stay-time").val();
        var extraServieList = [];
        $("input:checkbox[name=extra-services]:checked").each(function () {

            extraServieList.push($(this).val());
        });
        var comments = $("#schedule-plan-comments").val();
        var havePet = document.getElementById("havePet").checked;
        var addressID = document.querySelector('input[name="address"]:checked').value;
        var fevServiceProviderID;
        var inputSPID = document.getElementsByName("fev-sp");
        for (var i = 0; i < inputSPID.length; i++) {
            if (inputSPID[i].checked) {
                fevServiceProviderID = inputSPID[i].value;
                break;
            }
        }

        var model = {
            ZipCode: pincode,
            ServiceHours: serviceBasicHours,
            ExtraHoursList: extraServieList,
            Comments: comments,
            HasPets: havePet,
            AddressId: addressID,
            FevServiceProviderID: fevServiceProviderID
        }
        if (parseInt(serviceStartTime.split(":")[0]) >= 12) {
            model["ServiceStartDate"] = serviceStartDate + " " + serviceStartTime;
        }
        else {
            model["ServiceStartDate"] = serviceStartDate + " " + serviceStartTime;
        }

        $.post("CompleteBooking", model, function (data) {
            if (data != "false") {
                document.getElementById("payment-complete-booking").disabled = true;
                $("#booking-service-span-service-id").html(parseInt(data));

                document.getElementById("booking-modal-link").click();

                $("#booking-modal-btn-ok").click(function () {
                    document.getElementById("helperland-logo-big").click();
                })
            }
            else {
                alert("Error"); //remove this alert
                $("#booking-modal-right-arrow-div").addClass("bg-danger");
                $("#booking-modal-content-div").html('<h3 class="text-danger">Error</h3>');
            }
        });
    });

});

function checkZipCode() {
    var postalCode = document.getElementById("postalCode").value;

    if (postalCode.length == 6) {
        document.getElementById("error-postalCode").innerHTML = "";

        $.post("IsValidPostalCode", { PostalCode: postalCode }, function (data) {
            var city = JSON.parse(data);
            if (data != "false") {
                //If pinocde match
                document.getElementById("pill-schedulePlan-tab").disabled = false;
                document.getElementById("pill-schedulePlan-tab").click();
                $("#add-new-address-form-city").val(city.CityName);
                updateAddressList();
                updateFevoriteServiceProviderList();
            }
            else {
                //If pinocde don't match
                document.getElementById("pill-schedulePlan-tab").disabled = true;
                document.getElementById("pill-yourDetails-tab").disabled = true;
                document.getElementById("pill-payment-tab").disabled = true;
                document.getElementById("error-postalCode").innerHTML = "We are not providing service in this area. We'll notify you if any helper would start working near your area.";
            }
        });
    }
    else {
        document.getElementById("pill-schedulePlan-tab").disabled = true;
        document.getElementById("error-postalCode").innerHTML = "Pincode should be 6 digit"
    }
}

function updateTotalPayment() {
    /**
     * Setting total payment from total service time
     */
    var total = 54.0 + (parseFloat($("#span-total-service-time").html()) - 3.0) * 18;
    $("#span-per-cleaning").html(total);
    $("#span-total-payment").html(total);
}

function updateDateTime() {
    document.getElementById("span-selected-date-time").innerHTML = document.getElementById("date-book-service").value + "  " + document.getElementById("start-time-book-service").value + "<br>";
}

function updateTotalServiceTime() {
    /**
     * Setting total service time from basic time and extra service time addition
     */
    var totaltime = parseFloat($("#basic-stay-time").val()) + ($('.checkbox-extra-service').filter(':checked').length) * 0.5;
    $("#span-total-service-time").html(totaltime);
}

function updateAddressList() {
    //If pinocde isValid than find address of user in User address table and get it if exist
    $.post("GetUserAddresses", { postalCode: $("#postalCode").val() }, function (data) {
        var json = JSON.parse(data);
        document.getElementById("list-of-addresses").innerHTML = "";
        for (var i = 0; i < json.length; i++) {
            var addressObj = json[i];

            document.getElementById("list-of-addresses").innerHTML +=
                '<div class="address mt-3 ps-3">' +
                '<label>' +
                '<div class="row pt-2 pb-2">' +
                '<div class="col-auto">' +
                '<input class="mt-3" type="radio" name="address" id="" value="' + addressObj.AddressId + '">' +
                '</div>' +
                '<div class="col">' +
                '<b>Address:</b> ' + addressObj.AddressLine1 + ' ' + addressObj.AddressLine2 + ', ' + addressObj.City + ' ' + addressObj.PostalCode + '<br>' +
                '<b>Phone number:</b> ' + addressObj.Mobile +
                '</div>' +
                '</div>' +
                '</label>' +
                '</div>';

        }
    });
}

function updateFevoriteServiceProviderList() {

    model = {};
    $.post("GetFevoriteServiceProviders", model, function (data) {
        var json = JSON.parse(data);
        document.getElementById("list-of-favourite-sp").innerHTML = "";
        if (json.length == 0) {
            $("#fev-sp-header-div").addClass("d-none");
        }
        else {
            $("#fev-sp-header-div").removeClass("d-none");
        }
        for (var i = 0; i < json.length; i++) {
            spObj = json[i];

            document.getElementById("list-of-favourite-sp").innerHTML +=
                '<div class="my-col-2 text-center">' +
                '<label>' +
                '<div class="rounded-grey-box mb-2">' +
                '<img class="fev-sp-icon" src="/assets/images/cap.png" alt="">' +
                '</div>' +
                '<b>' + spObj.TargetUserName + '</b>' +
                '<div class="btn btn-primary btn-select-sp mt-3">' +
                '<input id="sp-' + spObj.TargetUserID + '" onclick="selectUnselectSP(\'sp-' + spObj.TargetUserID + '\')" class="fev-sp-input d-none" type="checkbox" name="fev-sp" value="' + spObj.TargetUserID + '">' +
                'Select' +
                '</div>' +
                '</label>' +
                '</div>';
        }
    });
}

function selectUnselectSP(id) {
    //make all select btn normal
    var temp = document.getElementsByClassName("btn-select-sp")
    for (var i = 0; i < temp.length; i++) {
        temp[i].classList.remove("btn-select-sp-active");
    }

    if (document.getElementById(id).checked == true) {
        //If current btn checkbox is active than set active class
        document.getElementById(id).parentElement.classList.add('btn-select-sp-active');
        //uncheck all checkbox
        var checkboxes = document.getElementsByClassName('fev-sp-input')
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
        //make current checkbox checked because it was already checked and above line made it uncheck
        document.getElementById(id).checked = true;
    }
    else {
        //uncheck all checkbox
        var checkboxes = document.getElementsByClassName('fev-sp-input')
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
    }
}