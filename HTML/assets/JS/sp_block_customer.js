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
updateBlockCuatomer()

function updateBlockCuatomer() {


    // var SON.parse(data);
    $("#table-fev-pros tr").remove();
    for (i = 0; i < 10; i++) {
        var table = document.getElementById("table-fev-pros");
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        var name = 'Dhruvil' + ' ' + 'Patel';
        var spId = 69;
        var IsBlocked = false
        cell1.innerHTML = '<img class="fev-pros-cap-border" src="/assets/images/cap.png" alt="">';
        cell2.innerHTML = '<b>' + name + '</b>';

        var cell3_block = "";
        if (IsBlocked) {
            cell3_block =
                '<label>' +
                '<div class="d-inline-block blue-rounded-btn text-white cursor-pointer p-2 ps-3 pe-3 ms-2">' +
                '<span style="user-select:none;" class="text-white">Unblock</span>' +
                '<input checked id="block-sp-' + spId + '" class="d-none" type="checkbox" onclick="addToBlockUnblock(\'' + spId + '\')">' +
                '</div>'
            '</label>';
        }
        else {
            cell3_block =
                '<label>' +
                '<div class="d-inline-block blue-rounded-btn text-white cursor-pointer p-2 ps-3 pe-3 ms-2 bg-danger">' +
                '<span style="user-select:none;" class="text-white">Block</span>' +
                '<input  id="block-sp-' + spId + '" class="d-none" type="checkbox" onclick="addToBlockUnblock(\'' + spId + '\')">' +
                '</div>'
            '</label>';
        }
        cell3.innerHTML = cell3_block;

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
          alert(data);
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
          alert(data);
        }
      });
  
    }
  }