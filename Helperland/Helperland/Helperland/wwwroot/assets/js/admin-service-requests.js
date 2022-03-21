$(document).ready(function () {

  updateServiceRequest();
  updateUserManagement();
  $("#search-btn-search").click(function () {
    getDataInTablePagination(1);
  });
  var x = document.getElementsByName("pages");
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("pagination-page-num-a-tag-active");
  }
  $("#search-btn-clear").click(function () {
    $("#search-service-id").val("");
    $("#search-postal-code").val("");
    $("#search-email").val("");
    $("#search-customer").val("");
    $("#search-sp").val("");
    $("#search-status").val("");
    $("#search-start-date").val("");
    $("#search-end-date").val("");
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

  $("#reschedule-service-modal-update").click(function () {
    if (document.getElementById("start-date-reschedule-service").value != "") {
      var serviceId = $("#serviceId-reschedule-service").val();
      var date = $("#start-date-reschedule-service").val();
      var time = $("#start-time-reschedule-service").val();

      var addressLine1 = $("#edit-address-form-street-name").val();
      var addressLine2 = $("#edit-address-form-house-number").val();
      var city = $("#edit-address-form-city").val();
      var postalCode = $("#edit-address-form-postal-code").val();

      var reason = $("#reschedule-service-modal-reason").val();

      var model = {
        ServiceId: parseInt(serviceId),
        NewServiceDate: date,
        NewServicetime: time,
        AddressLine1: addressLine1,
        AddressLine2: addressLine2,
        City: city,
        PostalCode: postalCode,
        Reason: reason
      };

      $.post("RescheduleService", model, function (data) {
        if (data == "true") {
          document.getElementById("reschedule-service-modal-btn-close").click();
          updateServiceRequest();
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

  $("#user-management-search-btn-search").click(function () {
    getDataInUserTablePagination(1);
  });
  $("#user-management-search-btn-clear").click(function () {
    $("#user-management-search-user-name").val('');
    $("#user-management-search-user-role").val('');
    $("#user-management-search-phone-number").val('');
    $("#user-management-search-postal-code").val('');
    $("#user-management-search-email").val('');
    $("#user-management-search-start-date").val('');
    $("#user-management-search-end-date").val('');

  });

});
function export_excel() {
  $("#table-user-management").table2excel({
    exclude: ".noExl",
    filename: "Users.xls"
  });
}

function updateServiceRequest() {
  $.post("GetServiceRequests", {}, function (data) {
    var serviceRequests = JSON.parse(data);
    sessionStorage.setItem("serviceRequestsData", data);
    getDataInTablePagination(1);

    customer = [];
    sp = [];
    for (var i = 0; i < serviceRequests.length; i++) {
      if (!isCustomerInList(serviceRequests[i].CustomerName)) {
        customer.push(serviceRequests[i].CustomerName);
      }
      if (!isSPInList(serviceRequests[i].ServiceProviderFirstName + ' ' + serviceRequests[i].ServiceProviderLastName)) {
        if (serviceRequests[i].ServiceProviderFirstName != null)
          sp.push(serviceRequests[i].ServiceProviderFirstName + ' ' + serviceRequests[i].ServiceProviderLastName);
      }
    }
    function isCustomerInList(cName) {
      for (var i = 0; i < customer.length; i++) {
        if (customer[i] == cName) {
          return true;
        }
      }
      return false;
    }
    function isSPInList(spName) {
      for (var i = 0; i < sp.length; i++) {
        if (sp[i] == spName) {
          return true;
        }
      }
      return false;
    }

    $('#search-customer')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Select Customer</option>')
      .val('');
    for (var i = 0; i < customer.length; i++) {
      $("#search-customer").append($("<option>")
        .val(customer[i])
        .html(customer[i])
      );
    }

    $('#search-sp')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Select Service Provider</option>')
      .val('');
    for (var i = 0; i < sp.length; i++) {
      $("#search-sp").append($("<option>")
        .val(sp[i])
        .html(sp[i])
      );
    }

  });
}
function getDataInTablePagination(pageNo) {

  var data = sessionStorage.getItem("serviceRequestsData");
  var serviceRequests = JSON.parse(data);
  var matchedSearchRowIndex = Array(serviceRequests.length).fill().map((_, idx) => idx)
  var j = ((pageNo - 1) * 10)

  var serviceId = $("#search-service-id").val();
  var postalCode = $("#search-postal-code").val();
  var email = $("#search-email").val();
  var customer = $("#search-customer").val();
  var sp = $("#search-sp").val();
  var status = $("#search-status").val();
  var sDate = $("#search-start-date").val();

  var eDate = $("#search-end-date").val();

  if (serviceId != "") {
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (serviceRequests[matchedSearchRowIndex[i]].ServiceId != serviceId) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (postalCode != "") {
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (serviceRequests[matchedSearchRowIndex[i]].PostalCode != postalCode) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (email != "") {
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (serviceRequests[matchedSearchRowIndex[i]].Email != email) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (customer != "") {
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (serviceRequests[matchedSearchRowIndex[i]].CustomerName != customer) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (sp != "") {
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (serviceRequests[matchedSearchRowIndex[i]].ServiceProviderFirstName + ' ' + serviceRequests[matchedSearchRowIndex[i]].ServiceProviderLastName != sp) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (status != "") {
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (serviceRequests[matchedSearchRowIndex[i]].Status != status) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }

  if (sDate != "" && eDate == "") {
    sDate = sDate.split("-")[2] + '-' + sDate.split("-")[1] + '-' + sDate.split("-")[0];
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (serviceRequests[matchedSearchRowIndex[i]].ServiceStartDate != sDate) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (eDate != "" && sDate == "") {
    eDate = eDate.split("-")[2] + '-' + eDate.split("-")[1] + '-' + eDate.split("-")[0];
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (serviceRequests[matchedSearchRowIndex[i]].ServiceStartDate != eDate) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (eDate != "" && sDate != "") {
    sDate = sDate.split("-")[2] + '-' + sDate.split("-")[1] + '-' + sDate.split("-")[0];
    eDate = eDate.split("-")[2] + '-' + eDate.split("-")[1] + '-' + eDate.split("-")[0];
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (!(getTime(serviceRequests[matchedSearchRowIndex[i]].ServiceStartDate) >= getTime(sDate) && getTime(serviceRequests[matchedSearchRowIndex[i]].ServiceStartDate) <= getTime(eDate))) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }

  $("#table-service-request td").remove();
  for (; j < matchedSearchRowIndex.length && j < pageNo * 10; j++) {
    var i = matchedSearchRowIndex[j];

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
    cell2.setAttribute("data-label", "Service Date");
    cell3.setAttribute("data-label", "Customer details");
    cell4.setAttribute("data-label", "Service Provider");
    cell5.setAttribute("data-label", "Gross Amount");
    cell6.setAttribute("data-label", "Net Amount");
    cell7.setAttribute("data-label", "Discount");
    cell8.setAttribute("data-label", "Status");
    cell9.setAttribute("data-label", "Payment Status");
    cell10.setAttribute("data-label", "Action");

    var startDate = serviceRequests[i].ServiceStartDate;
    var duration = serviceRequests[i].ServiceTotalHour;
    var startTime = serviceRequests[i].ServiceStartTime;
    var customerName = serviceRequests[i].CustomerName;
    var address = serviceRequests[i].AddressLine1 + " " + serviceRequests[i].AddressLine2 + ", " + serviceRequests[i].City + " - " + serviceRequests[i].PostalCode;

    var email = serviceRequests[i].Email;

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
      cell4.innerHTML = temp_start_cell3 + temp_middle_cell3 + temp_end_cell3;
    }


    cell5.innerHTML =
      '<span>' + payment + '</span>';
    cell6.innerHTML =
      '<span>' + payment + '</span>';

    cell7.innerHTML = '';


    //0 --> Canceled
    //1 --> Completed
    const status = serviceRequests[i].Status;
    if (status == 1) {
      cell8.innerHTML =
        '<button disabled class="bg-warning text-white border-0">New</button>';
    }
    else if (status == 2) {
      cell8.innerHTML =
        '<button disabled class="bg-success text-white border-0">Completed</button>';
    }
    else if (status == 3) {
      cell8.innerHTML =
        '<button disabled class="bg-danger text-white border-0">Cancelled</button>';
    }
    else if (status == 4) {
      cell8.innerHTML =
        '<button disabled class="bg-primary text-white border-0">Accepted</button>';
    }

    cell9.innerHTML =
      '<button disabled class="bg-danger text-white border-0"><small>Not&nbsp;Appplicable</small></button>';


    // cell10.innerHTML = '<a href="#"><img class="mt-2" src="/assets/images/group-38.png" alt=""></a>';


    cell10.innerHTML =
      '<div class="popover__wrapper-three-dot">' +
      '<a class="cursor-pointer pt-1 pb-3 ps-3 pe-3 rounded-circle"><img class="mt-2" src="/assets/images/group-38.png" alt=""></a>' +
      '<div class="popover__content-three-dot">' +
      '<ul class="ps-0 popover-ul">' +
      '<li class="cursor-pointer"><a><span>Edit&nbsp;&&nbsp;Reschedule</span></a></li>' +
      '<li class="cursor-pointer"><a><span>Cancel&nbsp;SR&nbsp;by&nbsp;Cust</span></a></li>' +
      '<li class="cursor-pointer"><a><span>Inquiry</span></a></li>' +
      '<li class="cursor-pointer"><a><span>History&nbsp;Log</span></a></li>' +
      '<li class="cursor-pointer"><a><span>Download&nbsp;Invoice</span></a></li>' +
      '<li class="cursor-pointer"><a><span>Other&nbsp;Transactions</span></a></li>' +
      '</ul>' +
      '</div>' +
      '</div>';


    cell11.innerHTML = serviceRequests[i].AddressLine1;
    cell11.setAttribute("hidden", true);

    cell12.innerHTML = serviceRequests[i].AddressLine2;
    cell12.setAttribute("hidden", true);

    cell13.innerHTML = serviceRequests[i].City;
    cell13.setAttribute("hidden", true);

    cell14.innerHTML = serviceRequests[i].PostalCode;
    cell14.setAttribute("hidden", true);


  }

  var j = 0;
  document.getElementById("my-pagination").innerHTML = '';
  for (var k = 0; k < matchedSearchRowIndex.length; k = 10 + k) {
    j++;
    document.getElementById("my-pagination").innerHTML += '<a class="cursor-pointer pagination-page-num-a-tag" name="pages" id="page-num-' + j + '" onClick="getDataInTablePagination(\'' + j + '\')">' + j + '</a>';
  }
  document.getElementById("page-num-" + pageNo).classList.add("pagination-page-num-a-tag-active");

}


function updateUserManagement() {
  $.post("GetUsers", {}, function (data) {
    var users = JSON.parse(data);
    sessionStorage.setItem("allUsers", data);
    getDataInUserTablePagination(1);

    userName = [];
    for (var i = 0; i < users.length; i++) {
      if (!isCustomerInList(users[i].UserName)) {
        userName.push(users[i].UserName);
      }
    }
    function isCustomerInList(cName) {
      for (var i = 0; i < userName.length; i++) {
        if (userName[i] == cName) {
          return true;
        }
      }
      return false;
    }

    $('#user-management-search-user-name')
      .find('option')
      .remove()
      .end()
      .append('<option value="">User name</option>')
      .val('');
    for (var i = 0; i < userName.length; i++) {
      $("#user-management-search-user-name").append($("<option>")
        .val(userName[i])
        .html(userName[i])
      );
    }
  });
}
function getDataInUserTablePagination(pageNo) {
  var data = sessionStorage.getItem("allUsers");
  var users = JSON.parse(data);
  var matchedSearchRowIndex = Array(users.length).fill().map((_, idx) => idx)
  var j = ((pageNo - 1) * 10)


  var sUserName = $("#user-management-search-user-name").val();
  var sUserType = $("#user-management-search-user-role").val();
  var sPhone = $("#user-management-search-phone-number").val();
  var sPostal = $("#user-management-search-postal-code").val();
  var sEmail = $("#user-management-search-email").val();
  var sDate = $("#user-management-search-start-date").val();
  var eDate = $("#user-management-search-end-date").val();

  if (sUserName != "") {
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (users[matchedSearchRowIndex[i]].UserName != sUserName) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (sUserType != "") {
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (users[matchedSearchRowIndex[i]].UserTypeId != sUserType) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (sPhone != "") {
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (users[matchedSearchRowIndex[i]].Phone != sPhone) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (sPostal != "") {
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (users[matchedSearchRowIndex[i]].PostalCode != sPostal) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (sEmail != "") {
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (users[matchedSearchRowIndex[i]].Email != sEmail) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }

  if (sDate != "" && eDate == "") {
    sDate = sDate.split("-")[2] + '-' + sDate.split("-")[1] + '-' + sDate.split("-")[0];
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (users[matchedSearchRowIndex[i]].DateOfRegistration != sDate) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (eDate != "" && sDate == "") {
    eDate = eDate.split("-")[2] + '-' + eDate.split("-")[1] + '-' + eDate.split("-")[0];
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (users[matchedSearchRowIndex[i]].DateOfRegistration != eDate) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }
  if (eDate != "" && sDate != "") {
    sDate = sDate.split("-")[2] + '-' + sDate.split("-")[1] + '-' + sDate.split("-")[0];
    eDate = eDate.split("-")[2] + '-' + eDate.split("-")[1] + '-' + eDate.split("-")[0];
    for (var i = 0; i < matchedSearchRowIndex.length; i++) {
      if (!(getTime(users[matchedSearchRowIndex[i]].DateOfRegistration) >= getTime(sDate) && getTime(users[matchedSearchRowIndex[i]].DateOfRegistration) <= getTime(eDate))) {
        matchedSearchRowIndex.splice(i, 1);
        i--;
      }
    }
  }

  $("#table-user-management td").remove();

  for (; j < matchedSearchRowIndex.length && j < pageNo * 10; j++) {
    var i = matchedSearchRowIndex[j];

    var table = document.getElementById("table-user-management");
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);//Email hidden

    cell1.setAttribute("data-label", "User Name");
    cell2.setAttribute("data-label", "Role");
    cell3.setAttribute("data-label", "Date of Registration");
    cell4.setAttribute("data-label", "User Type");
    cell5.setAttribute("data-label", "Phone");
    cell6.setAttribute("data-label", "Postal code");
    cell7.setAttribute("data-label", "Status");
    cell8.setAttribute("data-label", "Action");


    var dateOfRegistration = users[i].DateOfRegistration


    cell1.innerHTML = '<p>' + users[i].UserName + '</p>';


    cell2.innerHTML =
      '';


    cell3.innerHTML =
      '<img src="/assets/images/calendar2.png" alt="">' +
      '<strong id="date"></strong> ' + dateOfRegistration;


    if (users[i].UserTypeId == 1) {
      cell4.innerHTML = 'Customer';
    }
    else if (users[i].UserTypeId == 2) {
      cell4.innerHTML = 'Service Provider';

    }


    cell5.innerHTML =
      '<span>' + users[i].Phone + '</span>';


    if (users[i].PostalCode != null)
      cell6.innerHTML =
        '<span>' + users[i].PostalCode + '</span>';


    //0 --> Canceled
    //1 --> Completed
    const status = users[i].Status;
    if (status == 1) {
      cell7.innerHTML =
        '<button disabled class="bg-success text-white border-0">Active</button>';
    }
    else if (status == 2) {
      cell7.innerHTML =
        '<button disabled class="bg-danger text-white border-0">DeActive</button>';
    }


    cell8.innerHTML =
      '<div class="popover__wrapper-three-dot">' +
      '<a class="cursor-pointer pt-1 pb-3 ps-3 pe-3 rounded-circle"><img class="mt-2" src="/assets/images/group-38.png" alt=""></a>' +
      '<div class="popover__content-three-dot">' +
      '<ul class="ps-0 popover-ul">' +
      '<li class="cursor-pointer"><a><span>Activate/DeActivate</span></a></li>' +
      '</ul>' +
      '</div>' +
      '</div>';


    cell9.innerHTML = users[i].Email;
    cell9.classList.add("noExl");
    cell9.setAttribute("hidden", true);
  }

  var j = 0;
  document.getElementById("user-pagination").innerHTML = '';
  for (var k = 0; k < matchedSearchRowIndex.length; k = 10 + k) {
    j++;
    document.getElementById("user-pagination").innerHTML += '<a class="cursor-pointer pagination-page-num-a-tag" name="pages" id="user-page-num-' + j + '" onClick="getDataInUserTablePagination(\'' + j + '\')">' + j + '</a>';
  }
  document.getElementById("user-page-num-" + pageNo).classList.add("pagination-page-num-a-tag-active");

}


function getTime(d) {
  return new Date(d.split("-").reverse().join("-")).getTime()
}

$('#table-service-request').on('click', 'li:nth-child(1)', function () {
  var status = $(this).parent().parent().parent().parent().siblings('td:nth-child(8)').text();
  if (status == "Accepted" || status == "New") {

    var serviceId = $(this).parent().parent().parent().parent().siblings('td:nth-child(1)').text();
    var dateTime = $(this).parent().parent().parent().parent().siblings('td:nth-child(2)').text();
    var date = dateTime.split(" ")[1];
    var time = dateTime.split(" ")[2];

    var addressLine1 = $(this).parent().parent().parent().parent().siblings('td:nth-child(11)').text();
    var addressLine2 = $(this).parent().parent().parent().parent().siblings('td:nth-child(12)').text();
    var city = $(this).parent().parent().parent().parent().siblings('td:nth-child(13)').text();
    var postalCode = $(this).parent().parent().parent().parent().siblings('td:nth-child(14)').text();
    $("#edit-address-form-street-name").val(addressLine1);
    $("#edit-address-form-house-number").val(addressLine2);
    $("#edit-address-form-city").val(city);
    $("#edit-address-form-postal-code").val(postalCode);


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
});

$('#table-service-request').on('click', 'li:nth-child(2)', function () {
  var status = $(this).parent().parent().parent().parent().siblings('td:nth-child(8)').text();
  if (status == "Accepted" || status == "New") {
    var serviceId = $(this).parent().parent().parent().parent().siblings('td:nth-child(1)').text();
    $("#serviceId-cancel-service").val(serviceId);
    document.getElementById("cancel-service-modal-a-tag").click();
  }
});

$('#table-user-management').on('click', 'li:nth-child(1)', function () {
  var status = $(this).parent().parent().parent().parent().siblings('td:nth-child(7)').text();
  var email = $(this).parent().parent().parent().parent().siblings('td:nth-child(9)').text();

  var model = {
    Status: status,
    Email: email
  }
  $.post("ActivateDeActivateUser", model, function (data) {
    if (data == "true") {
      showSuccessAlertMessage("Changes Saved");
      updateUserManagement();
    }
    else {
      showErrorAlertMessage(data);
    }
  });
});