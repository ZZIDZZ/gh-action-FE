var userTable = $('#user-table').DataTable({
    "paging": true,
    "ajax": { "url": "https://63a19776ba35b96522e25641.mockapi.io/users", "dataSrc": ""},
    "rowId": "id",
    "processing": true,
    // "serverSide": true,
    'language': {
        // 'paginate': {
        //   'previous': '<span class="prev-icon"></span>',
        //   'next': '<span class="next-icon"></span>'
        // },
        'loadingRecords': '&nbsp;',
        'processing': '<div class="spinner"></div>'
    },
    "responsive": true,
  
    "lengthChange": true,
    "searching": true,
    "ordering": true,
    "info": true,
    "autoWidth": true,
    "columns": [
    { 
        "title": "#",
        "data": "id" 
    },{ 
        "title": "avatar",
        "data": "avatar",
        "render": function(data, type){
            return '<td><img width="50px" src="' + data +'" class="avatar"></td>';
        }
    },{ 
        "title": "First Name",
        "data": "fname" 
    },{ 
        "title": "Last Name",
        "data": "lname" 
    },{ 
        "title": "Username",
        "data": "username" 
    },{
        data: "id",
        className: "dt-center",
        defaultContent: '<i class="fa fa-pencil"/>',
        orderable: false,
        "render": function(data, type){
            return `<a href="#update_modal" class='btn btn-sm btn-info updateUser' id="update-${data}" data-bs-toggle="modal" data-id="update-${data}" data-bs-target="#update_modal" data-target="#update_modal" data-bs-dismiss="modal" >Update</a> 
            <a href="#delete_modal" class='btn btn-sm btn-danger deleteUser' id="delete-${data}"  data-id="delete-${data}" data-bs-toggle="modal" data-bs-target="#delete_modal" data-bs-dismiss="modal" >Delete</a>`;
        }
    },
    ],
  });
  
  function createUser(user){
    var resp
    resp = fetch('https://63a19776ba35b96522e25641.mockapi.io/users/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
      console.log(response.status);
      if (response.status == 201){
        swal({
                title: "Success", 
                text: "succesfully created user", 
                icon: "success"
              },
        ).then(function(){
          location.reload();
        });
      } else{
        swal({
                title: "Failed", 
                text: "failed creating user", 
                icon: "failed"
              },
        ).then(function(){
          location.reload();
        });
      }
    })
    userTable.ajax.reload();
  }
  
  function updateUser(user, id){
    var resp
    resp = fetch(`https://63a19776ba35b96522e25641.mockapi.io/users/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
      console.log(response.status);
      if (response.status == 200){
        swal({
                title: "Success", 
                text: "succesfully updated user", 
                icon: "success"
              },
        ).then(function(){
          location.reload();
        });
      } else{
        swal({
                title: "Failed", 
                text: "failed updating user", 
                icon: "failed"
              },
        ).then(function(){
          location.reload();
        });
      }
    })
    userTable.ajax.reload();
  }
  
  function deleteUser(id){
    var resp
    resp = fetch(`https://63a19776ba35b96522e25641.mockapi.io/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
      console.log(response.status);
      if (response.status == 200){
        swal({
                title: "Success", 
                text: "succesfully deleted user", 
                icon: "success"
              },
        ).then(function(){
          location.reload();
        });
      } else{
        swal({
                title: "Failed", 
                text: "failed deleting user", 
                icon: "failed"
              },
        ).then(function(){
          location.reload();
        });
      }
    })
    userTable.ajax.reload();
  }
  
  $('#create_modal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).data('id');
    var fname = $(this).find('input[id="create_fname"]');
    var lname = $(this).find('input[id="create_lname"]');
    var username = $(this).find('input[id="create_username"]');
    var avatar = $(this).find('input[id="create_avatar"]');
    
    $(this).find('button[id="save"]').click(function() {
        user = {
          "fname": fname.val(),
          "lname": lname.val(),
          "username": username.val(),
          "avatar": avatar.val(),
        }
        createUser(user);
      });
  });
  
  var curRow;
  
  $('#update_modal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).data('id');
    id = id.split("-")[1];
    curRow = document.getElementById("user-table").rows[((parseInt(id) - 1) % 10) + 1];
    console.log("curRow");
    console.log(curRow);
    userValue = {
      "id": curRow.cells[0].innerHTML,
      "avatar": curRow.cells[1].innerHTML,
      "fname": curRow.cells[2].innerHTML,
      "lname": curRow.cells[3].innerHTML,
      "username": curRow.cells[4].innerHTML,
    }
    console.log("nice")
    console.log(userValue);
    console.log($(this).attr('id'));
    console.log(id);
    var fname = $(this).find('input[id="update_fname"]').val(userValue["fname"]);
    var lname = $(this).find('input[id="update_lname"]').val(userValue["lname"]);
    var username = $(this).find('input[id="update_username"]').val(userValue["username"]);
    var avatar = $(this).find('input[id="update_avatar"]').val(userValue["avatar"].match(/src=(.+?[\.jpg|\.gif|\.png]")/)[1].replace(/['"]+/g, ''));
    var user_id = userValue["id"];
    $(this).find('button[id="save"]').click(function() {
        user = {
          "fname": fname.val(),
          "lname": lname.val(),
          "username": username.val(),
          "avatar": avatar.val(),
        }
        updateUser(user, user_id);
      });
  });
  
  $('#delete_modal').on('show.bs.modal', function(e) {
    var id = $(e.relatedTarget).data('id');
    id = id.split("-")[1];
    var curRow = document.getElementById("user-table").rows[((parseInt(id) - 1) % 10) + 1]
    var user_id = curRow.cells[0].innerHTML
    $(this).find('button[id="confirm"]').click(function() {
        deleteUser(user_id);
      });
  });
  
  $('#update_modal').on('hidden.bs.modal', function (e) {
    console.log("deleted");
  })
  
  $('#delete_modal').on('hidden.bs.modal', function (e) {
    console.log("deleted");
  
  })