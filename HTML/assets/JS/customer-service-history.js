$(document).ready(function () {


  // Data will come from ajax call and loop will goes json length time
  for (i = 0; i < 50; i++) {
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

    cell1.setAttribute("data-label", "Service Id");
    cell2.setAttribute("data-label", "Service Date");
    cell3.setAttribute("data-label", "Service Provider");
    cell4.setAttribute("data-label", "Payment");
    cell5.setAttribute("data-label", "Actions");

    var startDate = (Math.floor(Math.random() * 27) + 1) + "/" + (Math.floor(Math.random() * 11) + 1) + "/2021";
    var duration = Math.ceil(Math.random() * 7) + 3; //3.5
    var startTime = '12:30';
    var endTime = '';
    if(startTime.split(":")[1] == '30'){
      endTime = parseFloat(startTime.split(":")[0]) + duration + 0.5;
    }
    else{
      endTime = parseFloat(startTime.split(":")[0]) + duration;
    }

    if((endTime + "").split(".")[1] == 5){
      endTime = (endTime + "").split(".")[0] + ":30";
    }
    else{
      endTime = (endTime + "").split(".")[0] + ":00";
    }

    var payment = (Math.floor(Math.random() * 250) + 50);
    var extras = "Inside cabinets";
    var address = "Address is this ummmmmm yaaaa yeeee hehehehehe";
    var phone = Math.round(Math.random() * 3000000000) + 4000000000;
    var email = "email@gmail.com";
    var comment = "This is commentssssssssssssssssssssssssssssss";

    cell1.innerHTML = '<p>' + i + '</p>';
    cell2.innerHTML =
      '<img src="./assets/images/calendar2.png" alt="">' +
      '<strong id="date"></strong> '+ startDate +'<br>' +
      '<img src="./assets/images/layer-14.png" alt="">' +
      '<span id="time"> '+ startTime + ' - ' + endTime + '</span>';

    const rating = Math.ceil(Math.random() * 5);

    temp_start_cell2 =
      '<div class="row">' +
      '<div class="col-3 ">' +
      '<img class="cap-border" src="./assets/images/cap.png" alt="">' +
      "</div>" +
      '<div class="col-9">' +
      "John wick <br>" +
      "<span>";

    temp_end_cell2 =
      "</span>" + "<span>" + rating + "</span>" + "</div>" + "</div>";

    temp_middle_cell2 = "";
    for (let i = 0; i < rating; i++) {
      temp_middle_cell2 =
        temp_middle_cell2 + '<img src="./assets/images/star1.png" alt="">';
    }
    for (let i = 0; i < 5 - rating; i++) {
      temp_middle_cell2 =
        temp_middle_cell2 + '<img src="./assets/images/star2.png" alt="">';
    }
    cell3.innerHTML = temp_start_cell2 + temp_middle_cell2 + temp_end_cell2;

    cell4.innerHTML =
      '<span class="blue-price">'+ payment +'</span>';

    cell5.innerHTML =
      '<button class="blue-rounded-btn text-white p-2" onclick="rescheduleService(\''+ i + '\',\''+ startDate + '\',\''+ startTime + '\')">Reschedule</button>' +
      '<button class="blue-rounded-btn text-white p-2 bg-danger" onclick="cancelService(\''+ i + '\')">Cancel</button>';

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
  }


  $('#table-dashboard').on('click', 'td:nth-child(1)', function () {
    getDataFromDashboardTable(this);
  });
  $('#table-dashboard').on('click', 'td:nth-child(2)', function () {
    getDataFromDashboardTable(this);
  });
  $('#table-dashboard').on('click', 'td:nth-child(3)', function () {
    getDataFromDashboardTable(this);
  });
  $('#table-dashboard').on('click', 'td:nth-child(4)', function () {
    getDataFromDashboardTable(this);
  });

  //Function for geeting data from row and set it to the reschedule modal
  function getDataFromDashboardTable(thisTd) {
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
    var col11_Comments = currentRow.find("td:eq(10)").text();

    $("#dashboard-service-modal-date").html(col2_ServiceDate);
    $("#dashboard-service-modal-duration").html(col11_Comments);
    $("#dashboard-service-modal-serviceId").html(col1_ServiceId);
    $("#dashboard-service-modal-extras").html(col6_Extras);
    $("#dashboard-service-modal-amount").html(col4_Payment);
    $("#dashboard-service-modal-address").html(col7_Address);
    $("#dashboard-service-modal-phone").html(col8_Phone);
    $("#dashboard-service-modal-email").html(col9_Email);
    $("#dashboard-service-modal-comments").html(col10_Comments);
    $("#dashboard-service-modal-havePet").html("I don't have pets at home");

    // alert(col2_ServiceDate)
    // alert(col6)
    // alert(col7)
    // alert(col8)
    // alert(col9)
    // alert(col10)
    document.getElementById("dashboard-service-details-a-tag").click();
  }

  //For setting left nav active tab's color to dark and set other to normal 
  $(".vertical-navbar-a-tag").click(function () {
    $(this).parent().siblings().removeClass("active-tab");
    $(this).parent().addClass("active-tab");

  });


  for (i = 0; i < 50; i++) {
    var table = document.getElementById("table-main");
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    cell1.setAttribute("data-label", "Service Details");
    cell2.setAttribute("data-label", "Service Provider");
    cell3.setAttribute("data-label", "Payment");
    cell4.setAttribute("data-label", "Status");
    cell5.setAttribute("data-label", "Rate SP");

    cell1.innerHTML =
      '<img src="./assets/images/calendar.png" alt="">' +
      '<strong id="date"> ' +
      (Math.floor(Math.random() * 27) + 1) +
      "/" +
      (Math.floor(Math.random() * 11) + 1) +
      "/2021</strong><br>" +
      '<span id="time">12:00 - 6:00</span>';

    const rating = Math.ceil(Math.random() * 5);
    temp_start_cell2 =
      '<div class="row">' +
      '<div class="col-3 ">' +
      '<img class="cap-border" src="./assets/images/cap.png" alt="">' +
      "</div>" +
      '<div class="col-9">' +
      "John wick <br>" +
      "<span>";

    temp_end_cell2 =
      "</span>" + "<span>" + rating + "</span>" + "</div>" + "</div>";

    temp_middle_cell2 = "";
    for (let i = 0; i < rating; i++) {
      temp_middle_cell2 =
        temp_middle_cell2 + '<img src="./assets/images/star1.png" alt="">';
    }
    for (let i = 0; i < 5 - rating; i++) {
      temp_middle_cell2 =
        temp_middle_cell2 + '<img src="./assets/images/star2.png" alt="">';
    }
    cell2.innerHTML = temp_start_cell2 + temp_middle_cell2 + temp_end_cell2;

    cell3.innerHTML =
      '<span class="blue-price">' +
      "&euro;" +
      (Math.floor(Math.random() * 250) + 50) +
      "</span>";

    //0 --> Canceled
    //1 --> Completed
    const status = Math.round(Math.random());
    if (status == 0) {
      cell4.innerHTML =
        '<a href="#" class="status-cancel text-white">Cancelled</a>';
    } else if (status == 1) {
      cell4.innerHTML =
        '<a href="#" class="status-complete text-white">Completed</a>';
    }

    cell5.innerHTML =
      '<input class="blue-rounded-btn btn-SP" type="button" value="Rate SP">';
  }




  $("#table-dashboard").DataTable({
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
    columnDefs: [{ orderable: false, targets: 4 }],
  });
  $("#table-main").DataTable({
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
    columnDefs: [{ orderable: false, targets: 4 }],
  });
});
function export_excel() {
  $("#table-main").table2excel({
    filename: "Service history.xls"
  });
}


function rescheduleService(serviceId, date, time){

  var splitDate = date.split('/');
  document.getElementById("date-reschedule-service").value = splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
  $('#start-time-reschedule-service').val(time);

  document.getElementById("reschedule-service-modal-a-tag").click();
}

function cancelService(serviceId){
  
  alert(serviceId)
  document.getElementById("cancel-service-modal-a-tag").click();
}