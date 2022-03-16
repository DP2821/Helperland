$(document).ready(function () {
  updateDashboardTable();
  updateServiceHistoryTabel();
  resetRateToOneStar();

  if (document.location.search.includes("my-account=true")) {
    document.getElementById("pills-my-account-a-tag").click();
    $("#pills-dashboard-list").removeClass("active-tab");
    updateMyDetails();
  }

  //For setting left nav active tab's color to dark and set other to normal 
  $(".vertical-navbar-a-tag").click(function () {
    $(this).parent().siblings().removeClass("active-tab");
    $(this).parent().addClass("active-tab");

  });

  $("#dashboard-service-modal-reschedule").click(function () {
    var serviceId = $(this).parent().siblings('p').children('#dashboard-service-modal-serviceId').html();
    var dateTime = $(this).parent().siblings('#dashboard-service-modal-date').html();

    rescheduleService(serviceId, dateTime.split(" ")[0], dateTime.split(" ")[1]);
  });

  $("#dashboard-service-modal-cancel").click(function () {
    var serviceId = $(this).parent().siblings('p').children('#dashboard-service-modal-serviceId').html();
    cancelService(serviceId);
  });

  $("#reschedule-service-modal-update").click(function () {
    if (document.getElementById("start-date-reschedule-service").value != "") {
      var serviceId = $("#serviceId-reschedule-service").val();
      var date = $("#start-date-reschedule-service").val();
      var time = $("#start-time-reschedule-service").val();

      var model = {
        ServiceId: parseInt(serviceId),
        NewServiceDate: date,
        NewServicetime: time
      };

      $.post("RescheduleService", model, function (data) {
        if (data == "true") {
          document.getElementById("reschedule-service-modal-btn-close").click();
          updateDashboardTable();
          showSuccessAlertMessage("Service has been successfully Rescheduled");
        }
        else {
          showErrorAlertMessage(data);
        }
      });
    }
    else {
      showErrorAlertMessage("Please select date...");
    }
  });

  $("#cancel-service-modal-cancel-now").click(function () {
    if (document.getElementById("cancel-service-modal-reason").value.length >= 5) {
      var serviceId = $("#serviceId-cancel-service").val();
      var reason = $("#cancel-service-modal-reason").val();

      var model = {
        ServiceId: parseInt(serviceId),
        Comments: reason
      }

      $.post("CancelService", model, function (data) {
        if (data == "true") {
          document.getElementById("cancel-service-modal-btn-close").click();
          updateDashboardTable();
          updateServiceHistoryTabel();
          showSuccessAlertMessage("Service has been successfully Cancelled");
        }
        else {
          showErrorAlertMessage("Something went wrong");
        }
      });
    }
    else {
      showErrorAlertMessage("Please write in brief, why you want to cancel service");
    }
  });

  $("#rating-service-submit-btn").click(function () {
    if (document.getElementById("rating-service-comments").value.length >= 5) {
      var serviceId = $("#rate-service-service-id").val();
      var serviceProviderId = $("#rate-service-service-provider-id").val();
      var comment = $("#rating-service-comments").val();

      var onTimeArrivalRating = document.querySelector('input[name="on-time-arrival-rating"]:checked').value;
      var friendlyRating = document.querySelector('input[name="friendly-rating"]:checked').value;
      var qualityOfServiceRating = document.querySelector('input[name="quality-of-service-rating"]:checked').value;

      var averageRatings = (parseInt(onTimeArrivalRating) + parseInt(friendlyRating) + parseInt(qualityOfServiceRating)) / 3;

      var model = {
        ServiceId: serviceId,
        ServiceProviderId: serviceProviderId,
        Comments: comment,
        OnTime: onTimeArrivalRating,
        Friendly: friendlyRating,
        QualityOfService: qualityOfServiceRating,
        Average: averageRatings
      }

      $.post("RateService", model, function (data) {
        if (data == "true") {
          document.getElementById("rate-service-modal-btn-close").click();
          updateServiceHistoryTabel();
          showSuccessAlertMessage("Your response has been submmited");
        }
        else {
          showErrorAlertMessage(data);
        }
      });

    }
    else {
      showErrorAlertMessage("Please write in brief about service");
    }
  });

  $("#pop-over-my-setting-a-tag").click(function (event) {

    event.preventDefault();
    document.getElementById("pills-my-account-a-tag").click();
    $("#pills-dashboard-list").removeClass("active-tab");
    updateMyDetails();

  });

  $("#pills-my-address-tab").click(function () {
    updateAddressList();
  });

  $("#my-details-save-btn").click(function () {

    var fname = $("#my-details-first-name").val();
    var lname = $("#my-details-last-name").val();
    var email = $("#my-details-email").val();
    var mobile = $("#my-details-mobile").val();
    var dob = $("#my-details-dob").val();

    if (fname != "" && lname != "" && email != "" && mobile != "" && dob != "") {
      if (!isNaN(mobile)) {
        if (mobile.length == 10) {
          var modal = {
            FirstName: fname,
            LastName: lname,
            Mobile: mobile,
            DateOfBirth: dob
          }

          $.post("UpdateCustomerDetails", modal, function (data) {
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
        showErrorAlertMessage("Number should be only digit")
      }
    }
    else {
      showErrorAlertMessage("Plaease fill all field");
    }

  });

  $("#edit-address-btn-edit").click(function () {
    var addressID = $("#edit-address-form-addres-id").val();
    var addressLine1 = $("#edit-address-form-street-name").val();
    var addressLine2 = $("#edit-address-form-house-number").val();
    var postalCode = $("#edit-address-form-postal-code").val();
    var city = $("#edit-address-form-city").val();
    var mobile = $("#edit-address-form-phone").val();
    var modal = {
      AddressId: parseInt(addressID),
      AddressLine1: addressLine1,
      AddressLine2: addressLine2,
      PostalCode: postalCode,
      City: city,
      Mobile: mobile
    }


    if (addressID == "") {
      var model2 = {
        StreetName: addressLine1,
        HouseNumber: addressLine2,
        PostalCode: postalCode,
        City: city,
        Phone: mobile
      }
      $.post("SaveUserAddress", model2, function (data) {

        if (parseInt(data) >= 1) {
          updateAddressList();
          document.getElementById("edit-address-modal-btn-close").click();
          showSuccessAlertMessage("Address is Successfully added");
        }
        else {
          showErrorAlertMessage("No data changed");
        }

      });
    }
    else {
      $.post("UpdateEditAddress", modal, function (data) {

        if (data == "true") {
          updateAddressList();
          document.getElementById("edit-address-modal-btn-close").click();
          showSuccessAlertMessage("Address is Successfully updated");
        }
        else {
          showErrorAlertMessage(data);
        }

      });
    }

  });

  $("#my-details-add-new-address-btn").click(function () {
    document.getElementById("edit-address-form-postal-code").disabled = false;
    $("#edit-address-form-street-name").val("");
    $("#edit-address-form-house-number").val("");
    $("#edit-address-form-postal-code").val("");
    $("#edit-address-form-city").val("");
    $("#edit-address-form-phone").val("");
    document.getElementById("edit-address-modal-a-tag").click();
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

  $("#pills-fev-pros-a-tag").click(function () {
    updateFevPros();
  });

  $("#edit-address-form-postal-code").change(function () {
    var postalcode = $(this).val();

    $.post("GetCityByZipCode", { postalcode: postalcode }, function (data) {
      if (data != "false") {
        $("#edit-address-form-city").val(data);
      }
      else {
        $("#edit-address-form-city").val("");
        showErrorAlertMessage("Invalid Zipcode");
      }
    });
  });

  $("input:radio[name=on-time-arrival-rating]").change(function () {
    var onTimeArrivalRating = document.querySelector('input[name="on-time-arrival-rating"]:checked').value;
    var friendlyRating = document.querySelector('input[name="friendly-rating"]:checked').value;
    var qualityOfServiceRating = document.querySelector('input[name="quality-of-service-rating"]:checked').value;

    var x = (parseInt(onTimeArrivalRating) + parseInt(friendlyRating) + parseInt(qualityOfServiceRating)) / 3 + "";
    $("#rating-modal-average-ratings").html(parseFloat(x).toFixed(2));
    document.getElementById("rating-modal-white-bg-div").style.left = (parseInt(x.split(".")[0]) * 30) + 1 + (parseFloat("0." + x.split(".")[1]) * 22) + "px";

    switch (onTimeArrivalRating) {
      case "1":
        $("#on-time-arrival-rating-p-2").html("☆");
        $("#on-time-arrival-rating-p-3").html("☆");
        $("#on-time-arrival-rating-p-4").html("☆");
        $("#on-time-arrival-rating-p-5").html("☆");
        break;
      case "2":
        $("#on-time-arrival-rating-p-2").html("★");
        $("#on-time-arrival-rating-p-3").html("☆");
        $("#on-time-arrival-rating-p-4").html("☆");
        $("#on-time-arrival-rating-p-5").html("☆");
        break;
      case "3":
        $("#on-time-arrival-rating-p-2").html("★");
        $("#on-time-arrival-rating-p-3").html("★");
        $("#on-time-arrival-rating-p-4").html("☆");
        $("#on-time-arrival-rating-p-5").html("☆");
        break;
      case "4":
        $("#on-time-arrival-rating-p-2").html("★");
        $("#on-time-arrival-rating-p-3").html("★");
        $("#on-time-arrival-rating-p-4").html("★");
        $("#on-time-arrival-rating-p-5").html("☆");
        break;
      case "5":
        $("#on-time-arrival-rating-p-2").html("★");
        $("#on-time-arrival-rating-p-3").html("★");
        $("#on-time-arrival-rating-p-4").html("★");
        $("#on-time-arrival-rating-p-5").html("★");
        break;
    }
  });

  $("input:radio[name=friendly-rating]").change(function () {
    var onTimeArrivalRating = document.querySelector('input[name="on-time-arrival-rating"]:checked').value;
    var friendlyRating = document.querySelector('input[name="friendly-rating"]:checked').value;
    var qualityOfServiceRating = document.querySelector('input[name="quality-of-service-rating"]:checked').value;

    var x = (parseInt(onTimeArrivalRating) + parseInt(friendlyRating) + parseInt(qualityOfServiceRating)) / 3 + "";
    $("#rating-modal-average-ratings").html(parseFloat(x).toFixed(2));
    document.getElementById("rating-modal-white-bg-div").style.left = (parseInt(x.split(".")[0]) * 30) + 1 + (parseFloat("0." + x.split(".")[1]) * 22) + "px";

    switch (friendlyRating) {
      case "1":
        $("#friendly-rating-p-2").html("☆");
        $("#friendly-rating-p-3").html("☆");
        $("#friendly-rating-p-4").html("☆");
        $("#friendly-rating-p-5").html("☆");
        break;
      case "2":
        $("#friendly-rating-p-2").html("★");
        $("#friendly-rating-p-3").html("☆");
        $("#friendly-rating-p-4").html("☆");
        $("#friendly-rating-p-5").html("☆");
        break;
      case "3":
        $("#friendly-rating-p-2").html("★");
        $("#friendly-rating-p-3").html("★");
        $("#friendly-rating-p-4").html("☆");
        $("#friendly-rating-p-5").html("☆");
        break;
      case "4":
        $("#friendly-rating-p-2").html("★");
        $("#friendly-rating-p-3").html("★");
        $("#friendly-rating-p-4").html("★");
        $("#friendly-rating-p-5").html("☆");
        break;
      case "5":
        $("#friendly-rating-p-2").html("★");
        $("#friendly-rating-p-3").html("★");
        $("#friendly-rating-p-4").html("★");
        $("#friendly-rating-p-5").html("★");
        break;
    }
  });

  $("input:radio[name=quality-of-service-rating]").change(function () {
    var onTimeArrivalRating = document.querySelector('input[name="on-time-arrival-rating"]:checked').value;
    var friendlyRating = document.querySelector('input[name="friendly-rating"]:checked').value;
    var qualityOfServiceRating = document.querySelector('input[name="quality-of-service-rating"]:checked').value;

    var x = (parseInt(onTimeArrivalRating) + parseInt(friendlyRating) + parseInt(qualityOfServiceRating)) / 3 + "";
    $("#rating-modal-average-ratings").html(parseFloat(x).toFixed(2));
    document.getElementById("rating-modal-white-bg-div").style.left = (parseInt(x.split(".")[0]) * 30) + 1 + (parseFloat("0." + x.split(".")[1]) * 22) + "px";

    switch (qualityOfServiceRating) {
      case "1":
        $("#quality-of-service-rating-p-2").html("☆");
        $("#quality-of-service-rating-p-3").html("☆");
        $("#quality-of-service-rating-p-4").html("☆");
        $("#quality-of-service-rating-p-5").html("☆");
        break;
      case "2":
        $("#quality-of-service-rating-p-2").html("★");
        $("#quality-of-service-rating-p-3").html("☆");
        $("#quality-of-service-rating-p-4").html("☆");
        $("#quality-of-service-rating-p-5").html("☆");
        break;
      case "3":
        $("#quality-of-service-rating-p-2").html("★");
        $("#quality-of-service-rating-p-3").html("★");
        $("#quality-of-service-rating-p-4").html("☆");
        $("#quality-of-service-rating-p-5").html("☆");
        break;
      case "4":
        $("#quality-of-service-rating-p-2").html("★");
        $("#quality-of-service-rating-p-3").html("★");
        $("#quality-of-service-rating-p-4").html("★");
        $("#quality-of-service-rating-p-5").html("☆");
        break;
      case "5":
        $("#quality-of-service-rating-p-2").html("★");
        $("#quality-of-service-rating-p-3").html("★");
        $("#quality-of-service-rating-p-4").html("★");
        $("#quality-of-service-rating-p-5").html("★");
        break;
    }
  });

  $("#pills-my-details-tab").click(function () {
    $(".my-details-ul").children().css("border-bottom", "3px solid grey");
    $(".my-details-ul").children().children().children().css("color", "#565656");
    $(this).children().css("color", "#1d7a8c");
    $(this).parent().css("border-bottom", "3px solid #1d7a8c");
  });
  $("#pills-my-address-tab").click(function () {
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


  $('#table-dashboard').on('click', 'td:nth-child(1)', function () {
    getDataFromDashboardTable(this, "dashboard");
  });
  $('#table-dashboard').on('click', 'td:nth-child(2)', function () {
    getDataFromDashboardTable(this, "dashboard");
  });
  $('#table-dashboard').on('click', 'td:nth-child(3)', function () {
    getDataFromDashboardTable(this, "dashboard");
  });
  $('#table-dashboard').on('click', 'td:nth-child(4)', function () {
    getDataFromDashboardTable(this, "dashboard");
  });

  $('#table-service-history').on('click', 'td:nth-child(1)', function () {
    getDataFromDashboardTable(this, "serviceHistory");
  });
  $('#table-service-history').on('click', 'td:nth-child(2)', function () {
    getDataFromDashboardTable(this, "serviceHistory");
  });
  $('#table-service-history').on('click', 'td:nth-child(3)', function () {
    getDataFromDashboardTable(this, "serviceHistory");
  });
  $('#table-service-history').on('click', 'td:nth-child(4)', function () {
    getDataFromDashboardTable(this, "serviceHistory");
  });

  $("#table-fev-pros").DataTable({
    dom: "tlip",
    pagingType: "full_numbers",
    language: {
      lengthMenu: "Show _MENU_ Entries",
      info: "Total Reocrd : _MAX_",
      paginate: {
        first: "<img src='./assets/images/first-page-ic.svg' alt='first' />",
        previous:
          "<img style='transform: rotate(90deg);' src='./assets/images/keyboard-right-arrow-button.png' alt='previous' />",
        next: "<img style='transform: rotate(-90deg);' src='./assets/images/keyboard-right-arrow-button.png' alt='previous' />",
        last: "<img style='transform: rotate(180deg);' src='./assets/images/first-page-ic.svg' alt='first' />",
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
    filename: "Service history.xls"
  });
}

//Function for geeting data from row and set it to the dashboard modal
function getDataFromDashboardTable(thisTd, tableName) {
  //Find Out Current Row
  var currentRow = $(thisTd).closest("tr");

  //Find the Particular Row Data
  var col1_ServiceId = currentRow.find("td:eq(0)").text();
  var col2_ServiceDate = currentRow.find("td:eq(1)").text();
  var col4_Payment = currentRow.find("td:eq(3)").text();
  var col6_Extras = currentRow.find("td:eq(5)").text();
  var col7_Address = currentRow.find("td:eq(6)").text();
  var col8_Phone = currentRow.find("td:eq(7)").text();
  var col9_Email = currentRow.find("td:eq(8)").text();
  var col10_Comments = currentRow.find("td:eq(9)").text();
  var col11_Duration = currentRow.find("td:eq(10)").text();
  var col12_HavePet = currentRow.find("td:eq(11)").text();

  $("#dashboard-service-modal-date").html(col2_ServiceDate);
  $("#dashboard-service-modal-duration").html(col11_Duration);
  $("#dashboard-service-modal-serviceId").html(col1_ServiceId);
  $("#dashboard-service-modal-extras").html(col6_Extras);
  $("#dashboard-service-modal-amount").html(col4_Payment);
  $("#dashboard-service-modal-address").html(col7_Address);
  $("#dashboard-service-modal-phone").html(col8_Phone);
  $("#dashboard-service-modal-email").html(col9_Email);
  $("#dashboard-service-modal-comments").html(col10_Comments);
  $("#dashboard-service-modal-havePet").html(col12_HavePet);

  if (tableName == "serviceHistory") {
    $("#dashboard-service-modal-btns-div").addClass("d-none");
  }
  else {
    $("#dashboard-service-modal-btns-div").removeClass("d-none");
  }
  document.getElementById("dashboard-service-details-a-tag").click();
}

function rescheduleService(serviceId, date, time) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;

  document.getElementById("start-date-reschedule-service").min = today;


  var splitDate = date.split("-");
  document.getElementById("start-date-reschedule-service").value = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
  $('#start-time-reschedule-service').val(time);
  $("#serviceId-reschedule-service").val(serviceId);

  document.getElementById("reschedule-service-modal-a-tag").click();
}

function cancelService(serviceId) {
  $("#serviceId-cancel-service").val(serviceId);
  document.getElementById("cancel-service-modal-a-tag").click();
}

function resetRateToOneStar() {
  $("#on-time-arrival-rating-1").prop("checked", true);
  $("#friendly-rating-1").prop("checked", true);
  $("#quality-of-service-rating-1").prop("checked", true);

  var onTimeArrivalRating = document.querySelector('input[name="on-time-arrival-rating"]:checked').value;
  var friendlyRating = document.querySelector('input[name="friendly-rating"]:checked').value;
  var qualityOfServiceRating = document.querySelector('input[name="quality-of-service-rating"]:checked').value;

  var x = (parseInt(onTimeArrivalRating) + parseInt(friendlyRating) + parseInt(qualityOfServiceRating)) / 3 + "";
  $("#rating-modal-average-ratings").html(x);
  document.getElementById("rating-modal-white-bg-div").style.left = (parseInt(x.split(".")[0]) * 30) + 1 + (parseFloat("0." + x.split(".")[1]) * 22) + "px";

}

function rateService(serviceId, serviceProviderId, serviceProviderName) {
  $("#rate-service-service-id").val(serviceId);
  $("#rate-service-service-provider-id").val(serviceProviderId);
  $("#rating-modal-sp-name").html(serviceProviderName);
  document.getElementById("rating-service-modal-a-tag").click();
}

var isDashboardUpdated = false;
function updateDashboardTable() {
  $.post("GetNewServices", { modal: "Modal" }, function (data) {
    var serviceRequests = JSON.parse(data);


    $("#table-dashboard td").remove();
    for (i = 0; i < serviceRequests.length; i++) {
      var table = document.getElementById("table-dashboard");

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

      cell1.setAttribute("data-label", "Service Id");
      cell2.setAttribute("data-label", "Service Date");
      cell3.setAttribute("data-label", "Service Provider");
      cell4.setAttribute("data-label", "Payment");
      cell5.setAttribute("data-label", "Actions");

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

      var address = serviceRequests[i].AddressLine1 + " " + serviceRequests[i].AddressLine2 + ", " + serviceRequests[i].City + " - " + serviceRequests[i].PostalCode;
      var phone = serviceRequests[i].Mobile;
      var email = serviceRequests[i].Email;
      var comment = serviceRequests[i].Comments;
      var havePet = serviceRequests[i].HasPets;


      cell1.innerHTML = '<p>' + serviceRequests[i].ServiceId + '</p>';


      cell2.innerHTML =
        '<img src="/assets/images/calendar2.png" alt="">' +
        '<strong id="date"></strong>' + startDate + '<br>' +
        '<img src="/assets/images/layer-14.png" alt="">' +
        '<span id="time"> ' + startTime + ' - ' + endTime + '</span>';

      if (serviceRequests[i].ServiceProviderId != null) {
        var sum = 0.0;
        for (var rat = 0; rat < serviceRequests[i].AverageRatings.length; rat++) {
          sum += parseFloat(serviceRequests[i].AverageRatings[rat]);
        }
        var averageRatings = 0;
        if (serviceRequests[i].AverageRatings.length != 0) {
          averageRatings = sum / serviceRequests[i].AverageRatings.length;
        }
        // const averageRatings = 3.0;
        temp_start_cell3 =
          '<div class="row">' +
          '<div class="col-3 ">' +
          '<img class="cap-border" src="/assets/images/cap.png" alt="">' +
          "</div>" +
          '<div class="col-9">' +
          "" + serviceRequests[i].ServiceProviderFirstName + " " + serviceRequests[i].ServiceProviderLastName + " <br>" +
          "<span>";

        temp_end_cell3 =
          "</span>" + "<span>" + averageRatings + "</span>" + "</div>" + "</div>";

        temp_middle_cell3 = "";
        for (let i = 0; i < averageRatings; i++) {
          temp_middle_cell3 =
            temp_middle_cell3 + '<img src="/assets/images/star1.png" alt="">';
        }
        for (let i = 0; i < 5 - averageRatings; i++) {
          temp_middle_cell3 =
            temp_middle_cell3 + '<img src="/assets/images/star2.png" alt="">';
        }
        cell3.innerHTML = temp_start_cell3 + temp_middle_cell3 + temp_end_cell3;

      }


      cell4.innerHTML =
        '<span class="blue-price">' + payment + '</span>';


      cell5.innerHTML =
        '<button class="blue-rounded-btn text-white p-2" onclick="rescheduleService(\'' + serviceRequests[i].ServiceId + '\',\'' + startDate + '\',\'' + startTime + '\')">Reschedule</button>' +
        '<button class="blue-rounded-btn text-white p-2 bg-danger" onclick="cancelService(\'' + serviceRequests[i].ServiceId + '\')">Cancel</button>';


      cell6.innerHTML = extras;
      cell6.setAttribute("hidden", true);

      cell7.innerHTML = address;
      cell7.setAttribute("hidden", true);

      cell8.innerHTML = phone;
      cell8.setAttribute("hidden", true);

      cell9.innerHTML = email;
      cell9.setAttribute("hidden", true);

      cell10.innerHTML = comment;
      cell10.setAttribute("hidden", true);

      cell11.innerHTML = duration;
      cell11.setAttribute("hidden", true);

      if (havePet)
        cell12.innerHTML = "I have pets at home";
      else
        cell12.innerHTML = "I don't have pets at home";
      cell12.setAttribute("hidden", true);
    }
    if(!isDashboardUpdated){
      isDashboardUpdated = true;
      $("#table-dashboard").DataTable({
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
          },
          { orderable: false, targets: 4 }
        ]
      });
    }
  });
}

var isServiceHistoryUpdated = false;
function updateServiceHistoryTabel() {

  $.post("GetCompletedCancelledServices", { modal: "Modal" }, function (data) {
    var serviceRequests = JSON.parse(data);

    $("#table-service-history td").remove();
    for (i = 0; i < serviceRequests.length; i++) {

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

      cell1.setAttribute("data-label", "Service Id");
      cell2.setAttribute("data-label", "Service Date");
      cell3.setAttribute("data-label", "Service Provider");
      cell4.setAttribute("data-label", "Payment");
      cell5.setAttribute("data-label", "Status");
      cell6.setAttribute("data-label", "Rate SP");

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

      var address = serviceRequests[i].AddressLine1 + " " + serviceRequests[i].AddressLine2 + ", " + serviceRequests[i].City + " - " + serviceRequests[i].PostalCode;
      var phone = serviceRequests[i].Mobile;
      var email = serviceRequests[i].Email;
      var comment = serviceRequests[i].Comments;
      var havePet = serviceRequests[i].HasPets;


      cell1.innerHTML = '<p>' + serviceRequests[i].ServiceId + '</p>';


      cell2.innerHTML =
        '<img src="/assets/images/calendar2.png" alt="">' +
        '<strong id="date"></strong>' + startDate + '<br>' +
        '<img src="/assets/images/layer-14.png" alt="">' +
        '<span id="time"> ' + startTime + ' - ' + endTime + '</span>';

      if (serviceRequests[i].ServiceProviderId != null) {
        var sum = 0.0;
        for (var rat = 0; rat < serviceRequests[i].AverageRatings.length; rat++) {
          sum += parseFloat(serviceRequests[i].AverageRatings[rat]);
        }
        var averageRatings = 0;
        if (serviceRequests[i].AverageRatings.length != 0) {
          averageRatings = sum / serviceRequests[i].AverageRatings.length;
        }
        // const averageRatings = 3.0;
        temp_start_cell3 =
          '<div class="row">' +
          '<div class="col-3 ">' +
          '<img class="cap-border" src="/assets/images/cap.png" alt="">' +
          "</div>" +
          '<div class="col-9">' +
          "" + serviceRequests[i].ServiceProviderFirstName + " " + serviceRequests[i].ServiceProviderLastName + " <br>" +
          "<span>";

        temp_end_cell3 =
          "</span>" + "<span>" + averageRatings + "</span>" + "</div>" + "</div>";

        temp_middle_cell3 = "";
        for (let i = 0; i < averageRatings; i++) {
          temp_middle_cell3 =
            temp_middle_cell3 + '<img src="/assets/images/star1.png" alt="">';
        }
        for (let i = 0; i < 5 - averageRatings; i++) {
          temp_middle_cell3 =
            temp_middle_cell3 + '<img src="/assets/images/star2.png" alt="">';
        }
        cell3.innerHTML = temp_start_cell3 + temp_middle_cell3 + temp_end_cell3;

      }


      cell4.innerHTML =
        '<span class="blue-price">' + payment + '</span>';


      //0 --> Canceled
      //1 --> Completed
      const status = serviceRequests[i].Status;
      if (status == 3) {
        cell5.innerHTML =
          '<button disabled href="#" class="status-cancel text-white">Cancelled</button>';

        cell13.innerHTML =
          '<input disabled class="blue-rounded-btn btn-SP" type="button" value="Rate SP">';

      } else if (status == 2) {
        cell5.innerHTML =
          '<button disabled href="#" class="status-complete text-white">Completed</button>';

        cell13.innerHTML =
          '<input class="blue-rounded-btn btn-SP" type="button" value="Rate SP"   onclick="rateService(\'' + serviceRequests[i].ServiceId + '\',\'' + serviceRequests[i].ServiceProviderId + '\',\'' + serviceRequests[i].ServiceProviderFirstName + " " + serviceRequests[i].ServiceProviderLastName + '\')">';

      }


      cell7.innerHTML = address;
      cell7.setAttribute("hidden", true);

      cell8.innerHTML = phone;
      cell8.setAttribute("hidden", true);

      cell9.innerHTML = email;
      cell9.setAttribute("hidden", true);

      cell10.innerHTML = comment;
      cell10.setAttribute("hidden", true);

      cell11.innerHTML = duration;
      cell11.setAttribute("hidden", true);

      cell6.innerHTML = extras;
      cell6.setAttribute("hidden", true);


      if (havePet)
        cell12.innerHTML = "I have pets at home";
      else
        cell12.innerHTML = "I don't have pets at home";
      cell12.setAttribute("hidden", true);
    }
    if(!isServiceHistoryUpdated){
      isServiceHistoryUpdated = true;
      $("#table-service-history").DataTable({
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
          },
          { orderable: false, targets: 4 }
        ],
      });
    }
  });
}

function updateMyDetails() {
  var modal = {}
  $.post("CustomerDetails", modal, function (data) {
    var myDetails = JSON.parse(data);

    $("#my-details-first-name").val(myDetails[0].FirstName);
    $("#my-details-last-name").val(myDetails[0].LastName);
    $("#my-details-email").val(myDetails[0].Email);
    $("#my-details-mobile").val(myDetails[0].Mobile);
    $("#my-details-dob").val(myDetails[0].DateOfBirth.split("T")[0]);

  });
}

function updateAddressList() {

  document.getElementById("my-address-list-of-address").innerHTML = "";
  $.post("CustomerAddresses", {}, function (data) {
    var addresses = JSON.parse(data);

    for (var i = 0; i < addresses.length; i++) {
      document.getElementById("my-address-list-of-address").innerHTML +=
        '<div class="my-address-row">' +
        '<div class="col">' +
        '<b>Address: </b><span>' + addresses[i].AddressLine1 + ' ' + addresses[i].AddressLine2 + ', ' + addresses[i].PostalCode + ' ' + addresses[i].City + '</span><br>' +
        '<b>Phone number: </b><span>' + addresses[i].Mobile + '</span>' +
        '</div>' +
        '<div class="col-2">' +
        '<a class="text-decoration-none p-1 cursor-pointer" onclick="editAddress(\'' + addresses[i].AddressId + '\', \'' + addresses[i].AddressLine1 + '\', \'' + addresses[i].AddressLine2 + '\', \'' + addresses[i].PostalCode + '\', \'' + addresses[i].City + '\', \'' + addresses[i].Mobile + '\')">' +
        '<img src="/assets/images/edit-address.png" alt="edit" width="20px">' +
        '</a>' +
        '<a class="text-decoration-none p-1 cursor-pointer" onclick="removeAddress(\'' + addresses[i].AddressId + '\')">' +
        '<img src="/assets/images/remove-address.png" alt="remove" width="20px">' +
        '</a>' +
        '</div>' +
        '</div>'
    }

  });
}

function removeAddress(addressID) {
  modal = {
    AddressId: parseInt(addressID)
  }
  $.post("RemoveAddres", modal, function (data) {
    if (data == "true") {
      showSuccessAlertMessage("Address deleted successfully");
      updateAddressList();
    }
    else {
      showErrorAlertMessage(data);
    }
  });
}

function editAddress(addressID, addressLine1, addressLine2, postalCode, city, mobile) {
  $("#edit-address-form-addres-id").val(addressID);
  $("#edit-address-form-street-name").val(addressLine1);
  $("#edit-address-form-house-number").val(addressLine2);
  $("#edit-address-form-postal-code").val(postalCode);
  $("#edit-address-form-city").val(city);
  $("#edit-address-form-phone").val(mobile);
  document.getElementById("edit-address-modal-a-tag").click();
}

function updateFevPros() {

  $.post("GetFevouriteBlockedSPList", {}, function (data) {
    var fevPros = JSON.parse(data);

    if(fevPros.length > 0){
    
      $("#table-fev-pros tr").remove();
      for (i = 0; i < fevPros.length; i++) {
        var table = document.getElementById("table-fev-pros");
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
  
        var name = fevPros[i].FirstName + ' ' + fevPros[i].LastName;
        var spId = fevPros[i].SpId;
  
        cell1.innerHTML = '<img class="fev-pros-cap-border" src="/assets/images/cap.png" alt="">';
        cell2.innerHTML = '<b>' + name + '</b>';
  
        var sum = 0.0;
        for (var rat = 0; rat < fevPros[i].Ratings.length; rat++) {
          sum += parseFloat(fevPros[i].Ratings[rat]);
        }
        var averageRatings = 0;
        if (fevPros[i].Ratings.length != 0) {
          averageRatings = sum / fevPros[i].Ratings.length;
        }
  
        temp_end_cell3 =
          "</span>" + "<span>" + averageRatings + "</span>" + "</div>" + "</div>";
  
        temp_middle_cell3 = "";
        for (let i = 0; i < averageRatings; i++) {
          temp_middle_cell3 =
            temp_middle_cell3 + '<img src="/assets/images/star1.png" alt="">';
        }
        for (let i = 0; i < 5 - averageRatings; i++) {
          temp_middle_cell3 =
            temp_middle_cell3 + '<img src="/assets/images/star2.png" alt="">';
        }
        cell3.innerHTML = temp_middle_cell3 + temp_end_cell3;
  
        cell4.innerHTML =
          '<span class="">1 Cleaning</span>';
  
        var cell5_fev = "";
        if (fevPros[i].IsFavorite) {
          cell5_fev =
            '<label>' +
            '<div class="d-inline-block blue-rounded-btn text-white cursor-pointer p-2 ps-3 pe-3 bg-danger">' +
            '<span style="user-select:none;" class="text-white">Unfavourite</span>' +
            '<input checked id="fev-sp-' + spId + '" name="favourite-sp" class="d-none" type="checkbox" onclick="addToFavouriteUnFavourite(\'' + spId + '\')">' +
            '</div>' +
            '</label>';
        }
        else {
          cell5_fev =
            '<label>' +
            '<div class="d-inline-block blue-rounded-btn text-white cursor-pointer p-2 ps-3 pe-3">' +
            '<span style="user-select:none;" class="text-white">Favourite</span>' +
            '<input id="fev-sp-' + spId + '" name="favourite-sp" class="d-none" type="checkbox" onclick="addToFavouriteUnFavourite(\'' + spId + '\')">' +
            '</div>' +
            '</label>';
        }
        var cell5_block = "";
        if (fevPros[i].IsBlocked) {
          cell5_block =
            '<label>' +
            '<div class="d-inline-block blue-rounded-btn text-white cursor-pointer p-2 ps-3 pe-3 ms-2">' +
            '<span style="user-select:none;" class="text-white">Unblock</span>' +
            '<input checked id="block-sp-' + spId + '" class="d-none" type="checkbox" onclick="addToBlockUnblock(\'' + spId + '\')">' +
            '</div>'
          '</label>';
        }
        else {
          cell5_block =
            '<label>' +
            '<div class="d-inline-block blue-rounded-btn text-white cursor-pointer p-2 ps-3 pe-3 ms-2 bg-danger">' +
            '<span style="user-select:none;" class="text-white">Block</span>' +
            '<input  id="block-sp-' + spId + '" class="d-none" type="checkbox" onclick="addToBlockUnblock(\'' + spId + '\')">' +
            '</div>'
          '</label>';
        }
        cell5.innerHTML = cell5_fev + cell5_block;
  
      }
      
    }
    else{
      $("#table-fev-pros_wrapper").addClass("d-none");
      $("#no-sp-found-div").removeClass("d-none");
    }
  });

}

function addToFavouriteUnFavourite(spId) {
  var id = 'fev-sp-' + spId;
  if (document.getElementById(id).checked == true) {
    document.getElementById(id).disabled = true;

    var model = {
      TargetUserId: parseInt(spId),
      IsFavorite: true
    }
    $.post("UpdateFevouriteSP", model, function (data) {
      if (data == "true") {
        document.getElementById(id).parentElement.classList.add('bg-danger');
        var x = document.getElementById(id).parentNode.firstChild;
        x.innerHTML = "Unfavourite";
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
      TargetUserId: parseInt(spId),
      IsFavorite: false
    }
    $.post("UpdateFevouriteSP", model, function (data) {
      if (data == "true") {
        document.getElementById(id).parentElement.classList.remove('bg-danger');
        var x = document.getElementById(id).parentNode.firstChild;
        x.innerHTML = "Favourite";
        document.getElementById(id).disabled = false;
      }
      else {
        showErrorAlertMessage(data);
      }
    });
  }
}

function addToBlockUnblock(spId) {
  var id = 'block-sp-' + spId;

  if (document.getElementById(id).checked == true) {
    document.getElementById(id).disabled = true;

    var model = {
      TargetUserId: parseInt(spId),
      IsBlocked: true
    }
    $.post("UpdateBlockedSP", model, function (data) {
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
      TargetUserId: parseInt(spId),
      IsBlocked: false
    }
    $.post("UpdateBlockedSP", model, function (data) {
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