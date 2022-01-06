const userName = [
  "Iron man",
  "Captain america",
  "Hulk",
  "Black Widow",
  "Shang-chi",
  "Doctor Strange",
  "Thor",
  "Odin",
  "Spider-man",
  "Scarlet Witch",
];
const userType = ["Call Center", "Service Provider", "Customer"];
const role = ["Inquiry Manager", "Content Manager", "Finanace Manager"];
const city = [
  "Berlin",
  "Tokyo",
  "Moscow",
  "Nairobi",
  "Oslo",
  "Gandia",
  "Lisbon",
  "Rio",
  "Denver",
];
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
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);

    userName_id = Math.floor(Math.random() * userName.length);
    cell1.innerHTML = "<span>" + userName[userName_id] + "</span>";

    userType_id = Math.floor(Math.random() * userType.length);
    cell2.innerHTML = "<span>"+ userType[userType_id] +"</span>";

    role_id = Math.floor(Math.random() * role.length);
    cell3.innerHTML = "<span>"+ role[role_id] +"</span>";

    postalCode = Math.floor(Math.random() * 100000) + 300000;
    cell4.innerHTML = "<span>"+ postalCode +"</span>";

    city_id = Math.floor(Math.random() * city.length);
    cell5.innerHTML = "<span>"+ city[city_id] +"</span>";

    radius = Math.ceil(Math.random() * 100);
    cell6.innerHTML = "<span>"+ radius +" km</span>";

    userStatus_id = Math.round(Math.random());
    if(userStatus_id == 0){
        cell7.innerHTML =
            '<input class="btn-user-status-active" type="button" value="Active">';
    }
    else{
        cell7.innerHTML =
            '<input class="btn-user-status-inactive" type="button" value="Inactive">';
    }

    cell8.innerHTML =
      '<a href="#"><img class="mt-2" src="./assets/images/group-38.png" alt=""></a>';
  }
  $("#table-main").DataTable();
});
