jwt = localStorage.getItem('jwt');
$('form').submit(function(e) {
if($(this).hasClass( "sendtoserver")) {
    e.preventDefault(); // ignore button

    var form = $(this);
    var url = form.attr('action');

    $.ajax({
        type: "POST",
        url: url,
        accepts: {
            text: "application/x-www-form-urlencoded"
        },
        beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", 'Bearer '+ jwt);
        },
        data: form.serialize(), // serializes the form's elements.
        success: function (data) {
            alert(data); // show response from the php script.
        }
    });
}
});
