jwt = document.cookie.split(";")[0].split("=")[1];
$('form').submit(function(e) {
if($(this).hasClass( "sendtoserver")) {
    e.preventDefault(); // ignore button

    var form = $(this);
    var url = form.attr('action');
    var type = form.attr('method');
    type = (type != null || type != undefined)?type: "POST";
    $.ajax({
        type: type,
        url: url,
        accepts: {
            text: "application/json"
        },
        Authorization: jwt,
        beforeSend: function (xhr) {   //Include the bearer token in header
            xhr.setRequestHeader("Authorization", 'Bearer '+ jwt);
            xhr.setRequestHeader("Accept", "application/json");
        },
        data: form.serialize(), // serializes the form's elements.
        success: function (data) {
            if(data == 201 || data == 500 || data == 404){
                alert("Er ging iets fout");
            }
            else{
                alert("opgeslagen");
            }
        }
    });
}
});
function getbars(e){
        var parbutton = $(e).parent();
        var url = $(e).attr('action');
        var adress = parbutton.find("input[name='adress']")[0].value;
        var meters = parbutton.find("input[name='meters']")[0].value;
        var select = parbutton.find("select");
        $.ajax({
            type: "POST",
            url: url,
            data: {
                "adress": adress,
                "meters": meters,
            },
            accepts: {
                text: "application/json"
            },
            Authorization: jwt,
            beforeSend: function (xhr) {   //Include the bearer token in header
                xhr.setRequestHeader("Authorization", 'Bearer '+ jwt);
                xhr.setRequestHeader("Accept", "application/json");
            },
            success: function (data) {
                if(data == 201 || data == 500 || data == 404){
                    alert("Er ging iets fout");
                }
                else{
                    select.children().remove();
                    data.forEach((elements)=>{
                        if(elements.tags != undefined && elements.tags.name != undefined) {
                            select.append('<option value="' + elements.id + '">' + elements.tags.name + '</option>');
                        }
                    })
                }
            }
        });
}
