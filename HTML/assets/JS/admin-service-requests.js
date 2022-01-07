$(document).ready(function () {
  for (i = 0; i < 50; i++) {
    var table = document.getElementById("table-main");
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);

    service_ID = Math.floor(Math.random() * 100000) + 300000;
    cell1.innerHTML = "<span>" + service_ID + "</span>";

    cell2.innerHTML =
      '<img src="./assets/images/calendar2.png" alt="">' +
      '<span id="date"> ' +
      (Math.floor(Math.random() * 27) + 1) +
      "/" +
      (Math.floor(Math.random() * 11) + 1) +
      "/2021</span><br>" +
      '<img src="./assets/images/layer-14.png" alt="">' +
      '<span id="time">12:00 - 6:00</span>';

    cell3.innerHTML =
      "John wick <br>" +
      '<img src="./assets/images/layer-15.png" alt="">' +
      "<span>131 Pearl Street, New York</span>";

    const rating = Math.ceil(Math.random() * 5);
    temp_start_cell4 =
      '<div class="row">' +
      '<div class="col-3 ">' +
      '<img class="cap-border" src="./assets/images/cap.png" alt="">' +
      "</div>" +
      '<div class="col-9">' +
      "John wick <br>" +
      "<span>";

    temp_end_cell4 =
      "</span>" + "<span>" + rating + "</span>" + "</div>" + "</div>";

    temp_middle_cell4 = "";
    for (let i = 0; i < rating; i++) {
      temp_middle_cell4 =
        temp_middle_cell4 + '<img src="./assets/images/star1.png" alt="">';
    }
    for (let i = 0; i < 5 - rating; i++) {
      temp_middle_cell4 =
        temp_middle_cell4 + '<img src="./assets/images/star2.png" alt="">';
    }
    cell4.innerHTML = temp_start_cell4 + temp_middle_cell4 + temp_end_cell4;


    status_id = Math.floor(Math.random() * 4);
    if (status_id == 0) {
      cell5.innerHTML =
        '<input class="btn-status-new" type="button" value="New">';
    } else if (status_id == 1) {
      cell5.innerHTML =
        '<input class="btn-status-pending" type="button" value="Pending">';
    } else if (status_id == 2) {
      cell5.innerHTML =
        '<input class="btn-status-completed" type="button" value="Completed">';
    } else {
      cell5.innerHTML =
        '<input class="btn-status-cancelled" type="button" value="Cancelled">';
    }

    cell6.innerHTML =
      '<a href="#"><img class="mt-2" src="./assets/images/group-38.png" alt=""></a>';
  }


  $("#table-main").DataTable();
});
