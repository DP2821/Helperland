$(document).ready(function () {
  for (i = 0; i < 50; i++) {
    var table = document.getElementById("table-main");
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    cell1.setAttribute("data-label","Service ID");
    cell2.setAttribute("data-label","Service date");
    cell3.setAttribute("data-label","Customer details");
    cell4.setAttribute("data-label","Distance");
    cell5.setAttribute("data-label","Action");

    cell1.innerHTML = Math.floor(Math.random() * 1000);
    cell2.innerHTML =
      '<img src="./assets/images/calendar2.png" alt="">' +
      '<strong id="date"> ' + ((Math.floor(Math.random() * 27)) + 1) + '/' + (Math.floor(Math.random() * 11) + 1) +'/2021</strong><br>' +
      '<img src="./assets/images/layer-14.png" alt="">' +
      '<span id="time">12:00 - 6:00</span>';

    cell3.innerHTML =
      "John wick <br>" +
      '<img src="./assets/images/layer-15.png" alt="">' +
      "<span>131 Pearl Street, New York</span>";

    cell4.innerHTML = Math.floor(Math.random() * 100) + " km";
    cell5.innerHTML =
      '<input class="blue-rounded-btn btn-cancel" type="button" value="Cancel">';
  }
  $("#table-main").DataTable({
    "dom" : 'tlip',
    pagingType: "full_numbers",
    "language" : {
      "lengthMenu" : "Show _MENU_ Entries",
      "info": "Total Reocrd : _MAX_",
      paginate: {
        first: "<img src='./assets/images/first-page-ic.svg' alt='first' />",
        previous: "<img style='transform: rotate(90deg);' src='./assets/images/keyboard-right-arrow-button.png' alt='previous' />",
        next: "<img style='transform: rotate(-90deg);' src='./assets/images/keyboard-right-arrow-button.png' alt='previous' />",
        last: "<img style='transform: rotate(180deg);' src='./assets/images/first-page-ic.svg' alt='first' />", 
      },
    },
    columnDefs: [
      { orderable: false, targets: 4 },
    ],
  });
});


function export_excel(){
  $("#table-main").table2excel({
    filename: "Upcoming services.xls"
});
}