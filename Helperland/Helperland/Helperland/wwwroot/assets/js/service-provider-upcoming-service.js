$(document).ready(function () {

  updateServiceRequestTable();
  updateUpcomingServicesTable();
  upateServieHistory();
  updateMyRatingTable();
  updateBlockCuatomer();
  // loadMapInModal();

  if (document.location.search.includes("my-account=true")) {
    document.getElementById("pills-my-account-a-tag").click();
    $("#pills-dashboard-list").removeClass("active-tab");
    updateMyDetails();
  }
  $(".vertical-navbar-a-tag").click(function () {
    $(this).parent().siblings().removeClass("active-tab");
    $(this).parent().addClass("active-tab");

  });
  $("#have-pet").change(function () {
    if (document.getElementById("have-pet").checked) {
      updateServiceRequestTable(true);
    }
    else {
      updateServiceRequestTable(false);
    }
  });
  $("#new-service-request-modal-accept").click(function () {
    var serviceId = $("#new-service-request-modal-serviceId").html();
    acceptService(serviceId);
  });
  $("#upcoming-service-modal-cancel").click(function () {
    var serviceId = $("#new-service-request-modal-serviceId").html();
    cancelService(serviceId);
  });
  $("#upcoming-service-modal-complete").click(function () {
    var serviceId = $("#new-service-request-modal-serviceId").html();
    completeService(serviceId);
  });

  $("#pop-over-my-setting-a-tag").click(function (event) {

    event.preventDefault();
    document.getElementById("pills-my-account-a-tag").click();
    $("#pills-dashboard-list").removeClass("active-tab");
    updateMyDetails();

  });
  $("#pills-my-details-tab").click(function () {
    $(".my-details-ul").children().css("border-bottom", "3px solid grey");
    $(".my-details-ul").children().children().children().css("color", "#565656");
    $(this).children().css("color", "#1d7a8c");
    $(this).parent().css("border-bottom", "3px solid #1d7a8c");
  });
  $("#pills-change-password-tab").click(function () {
    $(".my-details-ul").children().css("border-bottom", "3px solid grey");
    $(".my-details-ul").children().children().children().css("color", "#565656");
    $(this).children().css("color", "#1d7a8c");
    $(this).parent().css("border-bottom", "3px solid #1d7a8c");
  });

  $("#change-password-btn-save").click(function () {
    var oldPass = $("#old-password").val();
    var newPass = $("#new-password").val();
    var confPass = $("#confirm-password").val();

    if (oldPass != "" && newPass != "" && confPass != "") {
      if (newPass == confPass) {
        var model = {
          OldPassword: oldPass,
          NewPassword: newPass,
        }

        $.post("ChnagePassword", model, function (data) {
          if (data == "true") {
            showSuccessAlertMessage("Password changed successfully");
          }
          else {
            showErrorAlertMessage(data);
          }
        });
      }
      else {
        showErrorAlertMessage("Both Password are not same");
      }
    }
    else {
      showErrorAlertMessage("Please fill all field");
    }
  });

  $("#address-postal-code").change(function () {
    var postalcode = $(this).val();

    $.post("GetCityByZipCode", { postalcode: postalcode }, function (data) {
      if (data != "false") {
        $("#address-city").val(data);
      }
      else {
        $("#address-city").val("");
        showErrorAlertMessage("Invalid Zipcode");
      }
    });
  });

  $("#my-details-save-btn").click(function () {

    var fname = $("#my-details-first-name").val();
    var lname = $("#my-details-last-name").val();
    var email = $("#my-details-email").val();
    var mobile = $("#my-details-mobile").val();
    var dob = $("#my-details-dob").val();
    var gender = $("input:radio[name=gender]:checked").val();
    var addressLine1 = $("#address-street-name").val();
    var addressLine2 = $("#address-house-number").val();
    var zipCode = $("#address-postal-code").val();
    var city = $("#address-city").val();


    if (fname != "" && lname != "" && email != "" && mobile != "" && dob != "") {
      if (!isNaN(mobile)) {
        if (mobile.length == 10) {
          var modal = {
            FirstName: fname,
            LastName: lname,
            Mobile: mobile,
            DateOfBirth: dob,
            Gender: gender,
            AddressLine1: addressLine1,
            AddressLine2: addressLine2,
            ZipCode: zipCode,
            City: city
          }

          $.post("UpdateSPDetails", modal, function (data) {
            if (data == "true") {
              updateMyDetails();
              showSuccessAlertMessage("Profile successfully updated");
            }
            else {
              showErrorAlertMessage(data);
            }
          });
        }
        else {
          showErrorAlertMessage("Mobile number should be 10 digit");
        }
      }
      else {
        showErrorAlertMessage("Number should be only digit");
      }
    }
    else {
      showErrorAlertMessage("Plaease fill all field");
    }

  });

  $('#table-service-request').on('click', 'td:nth-child(1)', function () {
    getDataFromServiceRequestTable(this, "newServices");
  });
  $('#table-service-request').on('click', 'td:nth-child(2)', function () {
    getDataFromServiceRequestTable(this, "newServices");
  });
  $('#table-service-request').on('click', 'td:nth-child(3)', function () {
    getDataFromServiceRequestTable(this, "newServices");
  });
  $('#table-service-request').on('click', 'td:nth-child(4)', function () {
    getDataFromServiceRequestTable(this, "newServices");
  });

  $('#table-upcoming-services').on('click', 'td:nth-child(1)', function () {
    getDataFromServiceRequestTable(this, "upcomingServices");
  });
  $('#table-upcoming-services').on('click', 'td:nth-child(2)', function () {
    getDataFromServiceRequestTable(this, "upcomingServices");
  });
  $('#table-upcoming-services').on('click', 'td:nth-child(3)', function () {
    getDataFromServiceRequestTable(this, "upcomingServices");
  });
  $('#table-upcoming-services').on('click', 'td:nth-child(4)', function () {
    getDataFromServiceRequestTable(this, "upcomingServices");
  });

  $('#table-service-history').on('click', 'td:nth-child(1)', function () {
    getDataFromServiceRequestTable(this, "serviceHistory");
  });
  $('#table-service-history').on('click', 'td:nth-child(2)', function () {
    getDataFromServiceRequestTable(this, "serviceHistory");
  });
  $('#table-service-history').on('click', 'td:nth-child(3)', function () {
    getDataFromServiceRequestTable(this, "serviceHistory");
  });
  $("#table-block-customer").DataTable({
    dom: "tlip",
    pagingType: "full_numbers",
    language: {
      lengthMenu: "Show _MENU_ Entries",
      info: "",
      paginate: {
        first: "<img src='/assets/images/first-page-ic.svg' alt='first' />",
        previous:
          "<img style='transform: rotate(90deg);' src='/assets/images/keyboard-right-arrow-button.png' alt='previous' />",
        next: "<img style='transform: rotate(-90deg);' src='/assets/images/keyboard-right-arrow-button.png' alt='previous' />",
        last: "<img style='transform: rotate(180deg);' src='/assets/images/first-page-ic.svg' alt='first' />",
      },
    },
    columnDefs: [
      {
        "defaultContent": "-",
        "targets": "_all",
      }
    ],
  });
});

function export_excel() {
  $("#table-service-history").table2excel({
    filename: "Service History.xls"
  });
}

var isServiceRequestUpdated = false;
function updateServiceRequestTable(hasPet) {
  $.post("GetNewServices", {}, function (data) {
    var serviceRequests = JSON.parse(data);


    $("#table-service-request td").remove();
    for (i = 0; i < serviceRequests.length; i++) {
      if (!hasPet || serviceRequests[i].HasPets) {
        var table = document.getElementById("table-service-request");

        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        var cell9 = row.insertCell(8);
        var cell10 = row.insertCell(9);
        var cell11 = row.insertCell(10);
        var cell12 = row.insertCell(11);
        var cell13 = row.insertCell(12);
        var cell14 = row.insertCell(13);

        cell1.setAttribute("data-label", "Service Id");
        cell2.setAttribute("data-label", "Service date");
        cell3.setAttribute("data-label", "Customer details");
        cell4.setAttribute("data-label", "Payment");
        cell5.setAttribute("data-label", "Time conflict");
        cell5.setAttribute("data-label", "Actions");

        var customerName = serviceRequests[i].CustomerName;
        var startDate = serviceRequests[i].ServiceStartDate;
        var duration = serviceRequests[i].ServiceTotalHour;
        var startTime = serviceRequests[i].ServiceStartTime;

        var endTime = '';
        if (startTime.split(":")[1] == '30') {
          endTime = parseFloat(startTime.split(":")[0]) + duration + 0.5;
        }
        else {
          endTime = parseFloat(startTime.split(":")[0]) + duration;
        }
        if ((endTime + "").split(".")[1] == 5) {
          endTime = (endTime + "").split(".")[0] + ":30";
        }
        else {
          endTime = (endTime + "").split(".")[0] + ":00";
        }

        var payment = serviceRequests[i].TotalCost;
        var extras = "";
        for (var e = 0; e < serviceRequests[i].ServiceExtraId.length; e++) {
          switch (serviceRequests[i].ServiceExtraId[e]) {
            case 1:
              extras += "Inside cabinate, ";
              break;
            case 2:
              extras += "Inside fridge, ";
              break;
            case 3:
              extras += "Inside oven, ";
              break;
            case 4:
              extras += "Laundry wash & dry, ";
              break;
            case 5:
              extras += "Interior window, ";
              break;
          }
        }
        //For remove extra coma at the end
        extras = extras.substring(0, extras.length - 2);

        var address = serviceRequests[i].AddressLine1 + " " + serviceRequests[i].AddressLine2 + " <br>" + serviceRequests[i].PostalCode + " " + serviceRequests[i].City;
        var phone = serviceRequests[i].Mobile;
        var email = serviceRequests[i].Email;
        var comment = serviceRequests[i].Comments;
        var havePet = serviceRequests[i].HasPets;
        var conflict = serviceRequests[i].Conflict;



        cell1.innerHTML = '<p>' + serviceRequests[i].ServiceId + '</p>';


        cell2.innerHTML =
          '<img src="/assets/images/calendar2.png" alt="">' +
          '<strong id="date"></strong> ' + startDate + '<br>' +
          '<img src="/assets/images/layer-14.png" alt="">' +
          '<span id="time"> ' + startTime + ' - ' + endTime + '</span>';

        cell3.innerHTML =
          '<div class="row">' +
          '<div class="col-auto p-0">' +
          '<img style="margin-top: 37px;" src="/assets/images/layer-15.png" alt="">' +
          '</div>' +
          '<div class="col">' +
          '<p class="mt-2 mb-2">' + customerName + '</p>' +
          '<div class="d-inline-block">' + address + '</div>'
        '</div>'
        '</div>';


        cell4.innerHTML =
          '<span class="blue-price">' + payment + '</span>';

        if (conflict != null) {
          var conflictDateTemp = conflict.ServiceStartDate.split("T")[0].split("-");
          var conflictDate = conflictDateTemp[2] + '-' + conflictDateTemp[1] + '-' + conflictDateTemp[0];
          cell5.innerHTML = conflictDate + " " + conflict.ServiceStartDate.split("T")[1];
        }

        cell6.innerHTML =
          '<button class="blue-rounded-btn text-white p-2" onclick="acceptService(\'' + serviceRequests[i].ServiceId + '\')">Accept</button>';


        cell7.innerHTML = extras;
        cell7.setAttribute("hidden", true);

        cell8.innerHTML = address;
        cell8.setAttribute("hidden", true);

        cell9.innerHTML = phone;
        cell9.setAttribute("hidden", true);

        cell10.innerHTML = email;
        cell10.setAttribute("hidden", true);

        cell11.innerHTML = comment;
        cell11.setAttribute("hidden", true);

        cell12.innerHTML = duration;
        cell12.setAttribute("hidden", true);

        if (havePet)
          cell13.innerHTML = "I have pets at home";
        else
          cell13.innerHTML = "I don't have pets at home";
        cell13.setAttribute("hidden", true);

        cell14.innerHTML = customerName;
        cell14.setAttribute("hidden", true);
      }
    }
    if (!isServiceRequestUpdated) {
      isServiceRequestUpdated = true;
      $("#table-service-request").DataTable({
        "dom": 'tlip',
        pagingType: "full_numbers",
        "language": {
          "lengthMenu": "Show _MENU_ Entries",
          "info": "Total Reocrd : _MAX_",
          paginate: {
            first: "<img src='/assets/images/first-page-ic.svg' alt='first' />",
            previous: "<img style='transform: rotate(90deg);' src='/assets/images/keyboard-right-arrow-button.png' alt='previous' />",
            next: "<img style='transform: rotate(-90deg);' src='/assets/images/keyboard-right-arrow-button.png' alt='previous' />",
            last: "<img style='transform: rotate(180deg);' src='/assets/images/first-page-ic.svg' alt='first' />"
          }
        },
        columnDefs: [
          {
            "defaultContent": "-",
            "targets": "_all",
          },
          { orderable: false, targets: 5 }
        ]
      });
    }

  });
}

var isUpcomingServiceUpdated = false;
function updateUpcomingServicesTable() {
  $.post("GetUpcomingServices", {}, function (data) {
    var upcomingServices = JSON.parse(data);


    $("#table-upcoming-services td").remove();
    for (i = 0; i < upcomingServices.length; i++) {
      var table = document.getElementById("table-upcoming-services");

      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);
      var cell8 = row.insertCell(7);
      var cell9 = row.insertCell(8);
      var cell10 = row.insertCell(9);
      var cell11 = row.insertCell(10);
      var cell12 = row.insertCell(11);
      var cell13 = row.insertCell(12);
      var cell14 = row.insertCell(13);

      cell1.setAttribute("data-label", "Service Id");
      cell2.setAttribute("data-label", "Service date");
      cell3.setAttribute("data-label", "Customer details");
      cell4.setAttribute("data-label", "Payment");
      cell5.setAttribute("data-label", "Distance");
      cell5.setAttribute("data-label", "Actions");

      var customerName = upcomingServices[i].CustomerName;
      var startDate = upcomingServices[i].ServiceStartDate;
      var duration = upcomingServices[i].ServiceTotalHour;
      var startTime = upcomingServices[i].ServiceStartTime;

      var endTime = '';
      if (startTime.split(":")[1] == '30') {
        endTime = parseFloat(startTime.split(":")[0]) + duration + 0.5;
      }
      else {
        endTime = parseFloat(startTime.split(":")[0]) + duration;
      }
      if ((endTime + "").split(".")[1] == 5) {
        endTime = (endTime + "").split(".")[0] + ":30";
      }
      else {
        endTime = (endTime + "").split(".")[0] + ":00";
      }

      var payment = upcomingServices[i].TotalCost;
      var extras = "";
      for (var e = 0; e < upcomingServices[i].ServiceExtraId.length; e++) {
        switch (upcomingServices[i].ServiceExtraId[e]) {
          case 1:
            extras += "Inside cabinate, ";
            break;
          case 2:
            extras += "Inside fridge, ";
            break;
          case 3:
            extras += "Inside oven, ";
            break;
          case 4:
            extras += "Laundry wash & dry, ";
            break;
          case 5:
            extras += "Interior window, ";
            break;
        }
      }
      //For remove extra coma at the end
      extras = extras.substring(0, extras.length - 2);

      var address = upcomingServices[i].AddressLine1 + " " + upcomingServices[i].AddressLine2 + " <br>" + upcomingServices[i].PostalCode + " " + upcomingServices[i].City;
      var phone = upcomingServices[i].Mobile;
      var email = upcomingServices[i].Email;
      var comment = upcomingServices[i].Comments;
      var havePet = upcomingServices[i].HasPets;



      cell1.innerHTML = '<p>' + upcomingServices[i].ServiceId + '</p>';


      cell2.innerHTML =
        '<img src="/assets/images/calendar2.png" alt="">' +
        '<strong id="date"></strong> ' + startDate + '<br>' +
        '<img src="/assets/images/layer-14.png" alt="">' +
        '<span id="time"> ' + startTime + ' - ' + endTime + '</span>';

      cell3.innerHTML =
        '<div class="row">' +
        '<div class="col-auto p-0">' +
        '<img style="margin-top: 37px;" src="/assets/images/layer-15.png" alt="">' +
        '</div>' +
        '<div class="col">' +
        '<p class="mt-2 mb-2">' + customerName + '</p>' +
        '<div class="d-inline-block">' + address + '</div>'
      '</div>'
      '</div>';


      cell4.innerHTML =
        '<span class="blue-price">' + payment + '</span>';


      var currentDateTime = new Date();
      var current_date = currentDateTime.getDate() + '-' + (currentDateTime.getMonth() + 1) + '-' + currentDateTime.getFullYear();

      if (getTime(current_date) > getTime(startDate)) {
        cell6.innerHTML =
          '<button class="blue-rounded-btn bg-danger text-white p-2" onclick="cancelService(\'' + upcomingServices[i].ServiceId + '\')">Cancel</button>' +
          '<button class="blue-rounded-btn text-white p-2 bg-success ms-2" onclick="completeService(\'' + upcomingServices[i].ServiceId + '\')">Complete</button>';
      }
      else {
        cell6.innerHTML =
          '<button class="blue-rounded-btn bg-danger text-white p-2" onclick="cancelService(\'' + upcomingServices[i].ServiceId + '\')">Cancel</button>';
      }


      cell7.innerHTML = extras;
      cell7.setAttribute("hidden", true);

      cell8.innerHTML = address;
      cell8.setAttribute("hidden", true);

      cell9.innerHTML = phone;
      cell9.setAttribute("hidden", true);

      cell10.innerHTML = email;
      cell10.setAttribute("hidden", true);

      cell11.innerHTML = comment;
      cell11.setAttribute("hidden", true);

      cell12.innerHTML = duration;
      cell12.setAttribute("hidden", true);

      if (havePet)
        cell13.innerHTML = "I have pets at home";
      else
        cell13.innerHTML = "I don't have pets at home";
      cell13.setAttribute("hidden", true);

      cell14.innerHTML = customerName;
      cell14.setAttribute("hidden", true);

    }
    if (!isUpcomingServiceUpdated) {
      isUpcomingServiceUpdated = true;
      $("#table-upcoming-services").DataTable({
        "dom": 'tlip',
        pagingType: "full_numbers",
        "language": {
          "lengthMenu": "Show _MENU_ Entries",
          "info": "Total Reocrd : _MAX_",
          paginate: {
            first: "<img src='/assets/images/first-page-ic.svg' alt='first' />",
            previous: "<img style='transform: rotate(90deg);' src='/assets/images/keyboard-right-arrow-button.png' alt='previous' />",
            next: "<img style='transform: rotate(-90deg);' src='/assets/images/keyboard-right-arrow-button.png' alt='previous' />",
            last: "<img style='transform: rotate(180deg);' src='/assets/images/first-page-ic.svg' alt='first' />"
          }
        },
        columnDefs: [
          {
            "defaultContent": "-",
            "targets": "_all",
          },
          { orderable: false, targets: 5 }
        ]
      });
    }
  });
}

var isServiceHistoryUpdated = false;
function upateServieHistory() {
  $.post("GetServiceHistory", {}, function (data) {
    var serviceHistory = JSON.parse(data);


    $("#table-service-history td").remove();
    for (i = 0; i < serviceHistory.length; i++) {
      var table = document.getElementById("table-service-history");

      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);
      var cell8 = row.insertCell(7);
      var cell9 = row.insertCell(8);
      var cell10 = row.insertCell(9);
      var cell11 = row.insertCell(10);
      var cell12 = row.insertCell(11);
      var cell13 = row.insertCell(12);
      var cell14 = row.insertCell(13);

      cell1.setAttribute("data-label", "Service Id");
      cell2.setAttribute("data-label", "Service date");
      cell3.setAttribute("data-label", "Customer details");

      var customerName = serviceHistory[i].CustomerName;
      var startDate = serviceHistory[i].ServiceStartDate;
      var duration = serviceHistory[i].ServiceTotalHour;
      var startTime = serviceHistory[i].ServiceStartTime;

      var endTime = '';
      if (startTime.split(":")[1] == '30') {
        endTime = parseFloat(startTime.split(":")[0]) + duration + 0.5;
      }
      else {
        endTime = parseFloat(startTime.split(":")[0]) + duration;
      }
      if ((endTime + "").split(".")[1] == 5) {
        endTime = (endTime + "").split(".")[0] + ":30";
      }
      else {
        endTime = (endTime + "").split(".")[0] + ":00";
      }

      var payment = serviceHistory[i].TotalCost;
      var extras = "";
      for (var e = 0; e < serviceHistory[i].ServiceExtraId.length; e++) {
        switch (serviceHistory[i].ServiceExtraId[e]) {
          case 1:
            extras += "Inside cabinate, ";
            break;
          case 2:
            extras += "Inside fridge, ";
            break;
          case 3:
            extras += "Inside oven, ";
            break;
          case 4:
            extras += "Laundry wash & dry, ";
            break;
          case 5:
            extras += "Interior window, ";
            break;
        }
      }
      //For remove extra coma at the end
      extras = extras.substring(0, extras.length - 2);

      var address = serviceHistory[i].AddressLine1 + " " + serviceHistory[i].AddressLine2 + " <br>" + serviceHistory[i].PostalCode + " " + serviceHistory[i].City;
      var phone = serviceHistory[i].Mobile;
      var email = serviceHistory[i].Email;
      var comment = serviceHistory[i].Comments;
      var havePet = serviceHistory[i].HasPets;



      cell1.innerHTML = '<p>' + serviceHistory[i].ServiceId + '</p>';


      cell2.innerHTML =
        '<img src="/assets/images/calendar2.png" alt="">' +
        '<strong id="date"></strong> ' + startDate + '<br>' +
        '<img src="/assets/images/layer-14.png" alt="">' +
        '<span id="time"> ' + startTime + ' - ' + endTime + '</span>';

      cell3.innerHTML =
        '<div class="row">' +
        '<div class="col-auto p-0">' +
        '<img style="margin-top: 37px;" src="/assets/images/layer-15.png" alt="">' +
        '</div>' +
        '<div class="col">' +
        '<p class="mt-2 mb-2">' + customerName + '</p>' +
        '<div class="d-inline-block">' + address + '</div>'
      '</div>'
      '</div>';


      cell4.innerHTML =
        '<span class="blue-price">' + payment + '</span>';
      cell4.setAttribute("hidden", true);
      cell5.setAttribute("hidden", true);
      cell6.setAttribute("hidden", true);

      cell7.innerHTML = extras;
      cell7.setAttribute("hidden", true);

      cell8.innerHTML = address;
      cell8.setAttribute("hidden", true);

      cell9.innerHTML = phone;
      cell9.setAttribute("hidden", true);

      cell10.innerHTML = email;
      cell10.setAttribute("hidden", true);

      cell11.innerHTML = comment;
      cell11.setAttribute("hidden", true);

      cell12.innerHTML = duration;
      cell12.setAttribute("hidden", true);

      if (havePet)
        cell13.innerHTML = "I have pets at home";
      else
        cell13.innerHTML = "I don't have pets at home";
      cell13.setAttribute("hidden", true);

      cell14.innerHTML = customerName;
      cell14.setAttribute("hidden", true);

    }
    if (!isServiceHistoryUpdated) {
      isServiceHistoryUpdated = true;
      $("#table-service-history").DataTable({
        "dom": 'tlip',
        pagingType: "full_numbers",
        "language": {
          "lengthMenu": "Show _MENU_ Entries",
          "info": "Total Reocrd : _MAX_",
          paginate: {
            first: "<img src='/assets/images/first-page-ic.svg' alt='first' />",
            previous: "<img style='transform: rotate(90deg);' src='/assets/images/keyboard-right-arrow-button.png' alt='previous' />",
            next: "<img style='transform: rotate(-90deg);' src='/assets/images/keyboard-right-arrow-button.png' alt='previous' />",
            last: "<img style='transform: rotate(180deg);' src='/assets/images/first-page-ic.svg' alt='first' />"
          }
        },
        columnDefs: [
          {
            "defaultContent": "-",
            "targets": "_all",
          }
        ]
      });
    }
  });
}

var isMyRatingUpdated = false;
function updateMyRatingTable() {
  $.post("GetMyRatings", {}, function (data) {
    var myRatings = JSON.parse(data);

    $("#table-my-ratings td").remove();
    for (var i = 0; i < myRatings.length; i++) {
      var table = document.getElementById("table-my-ratings");
      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);

      var serviceID = myRatings[i].ServiceId;
      var customerName = myRatings[i].CustomerName;
      var startDate = myRatings[i].ServiceStartDate;
      var duration = myRatings[i].ServiceTotalHour;
      var startTime = myRatings[i].ServiceStartTime;



      var endTime = '';
      if (startTime.split(":")[1] == '30') {
        endTime = parseFloat(startTime.split(":")[0]) + duration + 0.5;
      }
      else {
        endTime = parseFloat(startTime.split(":")[0]) + duration;
      }
      if ((endTime + "").split(".")[1] == 5) {
        endTime = (endTime + "").split(".")[0] + ":30";
      }
      else {
        endTime = (endTime + "").split(".")[0] + ":00";
      }

      cell1.innerHTML = '<p class="mt-2 mb-2">' + serviceID + '</p> <p class="mt-2 mb-2"><b>' + customerName + '</b></p>';

      cell2.innerHTML =
        '<img src="/assets/images/calendar2.png" alt="">' +
        '<strong id="date"></strong> ' + startDate + '<br>' +
        '<img src="/assets/images/layer-14.png" alt="">' +
        '<span id="time"> ' + startTime + ' - ' + endTime + '</span>';


      var averageRatings = myRatings[i].Ratings;

      temp_middle_cell3 = "";
      for (let i = 0; i < averageRatings; i++) {
        temp_middle_cell3 =
          temp_middle_cell3 + '<img src="/assets/images/star1.png" alt="">';
      }
      for (let i = 0; i < 5 - averageRatings; i++) {
        temp_middle_cell3 =
          temp_middle_cell3 + '<img src="/assets/images/star2.png" alt="">';
      }
      cell3.innerHTML = '<p class="m-0">Rating</p>' + temp_middle_cell3 + '<span>Very Good</span>';

      cell4.innerHTML = '<p class="m-0"><b>Customer Comment</b></p><p>' + myRatings[i].Comments + '<p/>';
    }


    if (!isMyRatingUpdated) {
      isMyRatingUpdated = true;
      $("#table-my-ratings").DataTable({
        dom: "tlip",
        pagingType: "full_numbers",
        language: {
          lengthMenu: "Show _MENU_ Entries",
          info: "Total Reocrd : _MAX_",
          paginate: {
            first: "<img src='/assets/images/first-page-ic.svg' alt='first' />",
            previous:
              "<img style='transform: rotate(90deg);' src='/assets/images/keyboard-right-arrow-button.png' alt='previous' />",
            next: "<img style='transform: rotate(-90deg);' src='/assets/images/keyboard-right-arrow-button.png' alt='previous' />",
            last: "<img style='transform: rotate(180deg);' src='/assets/images/first-page-ic.svg' alt='first' />",
          },
        },
        columnDefs: [
          {
            "defaultContent": "-",
            "targets": "_all",
          }
        ]
      });
    }
  });
}

function getDataFromServiceRequestTable(thisTd, tableName) {

  var currentRow = $(thisTd).closest("tr");

  //Find the Particular Row Data
  var col1_ServiceId = currentRow.find("td:eq(0)").text();
  var col2_ServiceDate = currentRow.find("td:eq(1)").text();
  var col4_Payment = currentRow.find("td:eq(3)").text();
  var col7_Extras = currentRow.find("td:eq(6)").text();
  var col8_Address = currentRow.find("td:eq(7)").text();
  var col11_Comments = currentRow.find("td:eq(10)").text();
  var col11_Duration = currentRow.find("td:eq(11)").text();
  var col13_HavePet = currentRow.find("td:eq(12)").text();
  var col14_CustomerName = currentRow.find("td:eq(13)").text();

  $("#new-service-request-modal-date").html(col2_ServiceDate);
  $("#new-service-request-modal-duration").html(col11_Duration);
  $("#new-service-request-modal-serviceId").html(col1_ServiceId);
  $("#new-service-request-modal-extras").html(col7_Extras);
  $("#new-service-request-modal-amount").html(col4_Payment);
  $("#new-service-request-modal-address").html(col8_Address);
  $("#new-service-request-modal-comments").html(col11_Comments);
  $("#new-service-request-modal-havePet").html(col13_HavePet);
  $("#new-service-request-modal-customer-name").html(col14_CustomerName);

  if (tableName == "newServices") {
    $("#new-service-request-modal-btns-div").removeClass("d-none");
    $("#upcoming-service-modal-btns-div").addClass("d-none");
  }
  else if (tableName == "upcomingServices") {
    var currentDateTime = new Date();
    var current_date = currentDateTime.getDate() + '-' + (currentDateTime.getMonth() + 1) + '-' + currentDateTime.getFullYear();

    if (getTime(current_date) > getTime(col2_ServiceDate.split(" ")[0])) {
      $("#upcoming-service-modal-complete").removeClass("d-none");
    }
    else {
      $("#upcoming-service-modal-complete").addClass("d-none");
    }

    $("#new-service-request-modal-btns-div").addClass("d-none");
    $("#upcoming-service-modal-btns-div").removeClass("d-none");
  }
  else {
    $("#new-service-request-modal-btns-div").addClass("d-none");
    $("#upcoming-service-modal-btns-div").addClass("d-none");
  }
  document.getElementById("new-service-request-details-a-tag").click();
}

function acceptService(serviceId) {
  $.post("AcceptService", { serviceId: parseInt(serviceId) }, function (data) {
    if (data == "true") {
      showSuccessAlertMessage("This service is successfully assigned to you");
      updateServiceRequestTable();
      updateUpcomingServicesTable();
    }
    else {
      showErrorAlertMessage(data);
    }
  });
}

function cancelService(serviceId) {
  $.post("CancelService", { serviceId: parseInt(serviceId) }, function (data) {
    if (data == "true") {
      showErrorAlertMessage("Service Cancelled!...");
      updateUpcomingServicesTable();
    }
    else {
      showErrorAlertMessage(data);
    }
  });
}

function completeService(serviceId) {
  $.post("CompleteService", { serviceId: parseInt(serviceId) }, function (data) {
    if (data == "true") {
      showSuccessAlertMessage("Service Completed");
      updateUpcomingServicesTable();
    }
    else {
      showErrorAlertMessage(data);
    }
  });
}

function getTime(d) {
  return new Date(d.split("-").reverse().join("-")).getTime()
}

function updateBlockCuatomer() {

  $.post("GetFevouriteBlockedCustomerList", {}, function (data) {
    var blockCustomers = JSON.parse(data);

    if (blockCustomers.length > 0) {

      // var SON.parse(data);
      $("#table-block-customer tr").remove();
      for (i = 0; i < blockCustomers.length; i++) {
        var table = document.getElementById("table-block-customer");
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        var CustomerId = blockCustomers[i].CustomerId;
        var name = blockCustomers[i].CustomerName;
        var IsBlocked = blockCustomers[i].IsBlocked;

        cell1.innerHTML = '<img class="block-customer-cap-border" src="/assets/images/cap.png" alt="">';
        cell2.innerHTML = '<p><b>' + name + '</b></p>';

        var cell3_block = "";
        if (IsBlocked) {
          cell3_block =
            '<label>' +
            '<div class="d-inline-block blue-rounded-btn text-white cursor-pointer p-2 ps-3 pe-3 ms-2">' +
            '<span style="user-select:none;" class="text-white">Unblock</span>' +
            '<input checked id="block-sp-' + CustomerId + '" class="d-none" type="checkbox" onclick="addToBlockUnblock(\'' + CustomerId + '\')">' +
            '</div>'
          '</label>';
        }
        else {
          cell3_block =
            '<label>' +
            '<div class="d-inline-block blue-rounded-btn text-white cursor-pointer p-2 ps-3 pe-3 ms-2 bg-danger">' +
            '<span style="user-select:none;" class="text-white">Block</span>' +
            '<input  id="block-sp-' + CustomerId + '" class="d-none" type="checkbox" onclick="addToBlockUnblock(\'' + CustomerId + '\')">' +
            '</div>'
          '</label>';
        }
        cell3.innerHTML = cell3_block;

      }
    }
    else {
      $("#table-block-customer_wrapper").addClass("d-none");
      $("#no-customer-found-div").removeClass("d-none");
    }
  });
}

function addToBlockUnblock(customerId) {
  var id = 'block-sp-' + customerId;

  if (document.getElementById(id).checked == true) {
    document.getElementById(id).disabled = true;
    var model = {
      TargetUserId: parseInt(customerId),
      IsBlocked: true
    }
    $.post("UpdateBlockedCustomer", model, function (data) {
      if (data == "true") {
        document.getElementById(id).parentElement.classList.remove('bg-danger');
        var x = document.getElementById(id).parentNode.firstChild;
        x.innerHTML = "Unblock";
        document.getElementById(id).disabled = false;
      }
      else {
        showErrorAlertMessage(data);
      }
    });

  }
  else {

    document.getElementById(id).disabled = true;

    var model = {
      TargetUserId: parseInt(customerId),
      IsBlocked: false
    }
    $.post("UpdateBlockedCustomer", model, function (data) {
      if (data == "true") {
        document.getElementById(id).parentElement.classList.add('bg-danger');
        var x = document.getElementById(id).parentNode.firstChild;
        x.innerHTML = "Block";
        document.getElementById(id).disabled = false;
      }
      else {
        showErrorAlertMessage(data);
      }
    });

  }
}

function updateMyDetails() {
  var modal = {}
  $.post("SPDetails", modal, function (data) {
    var myDetails = JSON.parse(data);

    if (data != false) {

      $("#my-details-first-name").val(myDetails[0].FirstName);
      $("#my-details-last-name").val(myDetails[0].LastName);
      $("#my-details-email").val(myDetails[0].Email);
      $("#my-details-mobile").val(myDetails[0].Mobile);
      $("#my-details-dob").val(myDetails[0].DateOfBirth.split("T")[0]);

      if (myDetails[0].Gender == 1) {
        document.getElementById("gender-male").checked = true;
      }
      else if (myDetails[0].Gender == 1) {
        document.getElementById("gender-female").checked = true;
      }
      else {
        document.getElementById("gender-not-to-say").checked = true;
      }
      if (myDetails[0].Address != null) {
        $("#address-street-name").val(myDetails[0].Address.AddressLine1);
        $("#address-house-number").val(myDetails[0].Address.AddressLine2);
        $("#address-postal-code").val(myDetails[0].Address.PostalCode);
      }
    }
    else {
      showErrorAlertMessage("Something went wrong")
    }
  });
}


// function loadMapInModal() {
//   zipcode = 383315;
//   url = "https://www.openstreetmap.org/search?query=" + zipcode;
//   // url = "https://www.w3schools.com"
//   $("#service-request-modal-map-div").html($('<iframe src="' + url + '" title="W3Schools Free Online Web Tutorials"></iframe>'));
//   // $("#service-request-modal-map-div").html("<h2>Hello</h2>");
// }

mapLoad();
function mapLoad() {
  var mapOptions = {
    center: [23.033863, 72.585022],
    zoom: 10
  }
  // Creating a map object
  var map = new L.map('service-request-modal-map-div', mapOptions);

  // Creating a Layer object
  var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

  // Adding layer to the map
  map.addLayer(layer);
}