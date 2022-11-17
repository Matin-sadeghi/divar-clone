function readfile(e) {
    return console.log(e);
    var data = {};
    data.path = '/home/test/pgadmin.txt';
    console.log(data);
      $.ajax({
        url: '/add-post',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(data) {
          console.log(data);
        }
      });
    }