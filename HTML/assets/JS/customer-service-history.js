$(document).ready(function () {
  for (i = 0; i < 10; i++) {
    var table = document.getElementById("table-main");
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    cell1.innerHTML =
      '<img src="./assets/images/calendar.png" alt="">' +
      '<span id="date">' + ((Math.floor(Math.random() * 27)) + 1) + '/' + (Math.floor(Math.random() * 11) + 1) +'/2021</span><br>' +
      '<span id="time">12:00 - 6:00</span>';

    const rating = Math.ceil(Math.random() * 5);
    temp_start_cell2 = '<div class="row">' +
    '<div class="col-3 ">' +
    '<img class="cap-border" src="./assets/images/cap.png" alt="">' +
    "</div>" +
    '<div class="col-9">' +
    "John wick <br>" +
    "<span>";

    temp_end_cell2 = "</span>" +
    "<span>" +
    rating +
    "</span>" +
    "</div>" +
    "</div>";

    temp_middle_cell2 = ''
    for(let i=0;i<rating;i++){
        temp_middle_cell2 = temp_middle_cell2 + '<img src="./assets/images/star1.png" alt="">';
    }
    for(let i=0;i<5-rating;i++){
        temp_middle_cell2 = temp_middle_cell2 + '<img src="./assets/images/star2.png" alt="">';
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
        '<a href="#" class="status-cancel text-white">Canceled</a>';
    } else if (status == 1) {
      cell4.innerHTML =
        '<a href="#" class="status-complete text-white">Completed</a>';
    }

    cell5.innerHTML =
      '<input class="blue-rounded-btn btn-SP" type="button" value="Rate SP">';
  }
//   $("#table-main").DataTable();
});
