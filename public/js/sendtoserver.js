jwt = document.cookie.split(";")[0].split("=")[1];
$('form').submit(function(e) {
if($(this).hasClass( "sendtoserver")) {
    e.preventDefault(); // ignore button
    var form = $(this);
    var url = form.attr('action');
    var type = form.attr('method');
    type = (type != null || type != undefined)?type: "POST";
    sendstuff(url,type, form.serialize())
}
if($(this).hasClass( "createrace")) {
    e.preventDefault(); // ignore button
    var form = $(this);
    var url = form.attr('action');
    var type = form.attr('method');
    type = (type != null || type != undefined)?type: "POST";
    sendstuff(url,type, form.serialize(), (data)=>{
        if(data != false){
            window.location.href = window.location.href.replace(window.location.href.split('/').pop(),'');
        }
    })
}
    if($(this).hasClass( "removerace")) {
        e.preventDefault(); // ignore button
        if (confirm('Weet je zekker dat je hem wilt verwijderen?')) {
            var form = $(this);
            var url = form.attr('action');
            var type = form.attr('method');
            type = (type != null || type != undefined) ? type : "POST";
            sendstuff(url, type, form.serialize(), (data) =>{
                window.location.href = window.location.href.replace(window.location.href.split('/').pop(), '');
            })
        }
    }
});

function sendstuff(url, type, data, returnfunction=null){
    $.ajax({
        type: type,
        url: url,
        accepts: {
            text: "application/json"
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
        },
        data: data,
        success: function (data, textStatus, xhr) {
            if(data == 201 || data == 500 || data == 404 || xhr.status == 404 || xhr.status == 500 || xhr.status == 201){
                if(returnfunction!= null){
                    returnfunction({nodata:false});
                }
                else {
                    alert("Er ging iets fout");
                }
            }
            else{
                if(returnfunction!= null){
                    returnfunction(data);
                }
                else {
                    location.reload();
                }
            }
        }
    });
}
function adddone(oldid, id){
    $.ajax({
        type: "POST",
        url: '/races/'+oldid+'/waypoints/check/'+id,
        accepts: {
            text: "application/json"
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Accept", "application/json");
        },
        success: function (data) {
            if(data == 201 || data == 500 || data == 404){
                alert("Er ging iets fout");
            }
            else{
                location.reload();
            }
        }
    });
}
function setmap(lat,long){
    map = $('#map')[0];
    map.src = 'https://www.openstreetmap.org/export/embed.html?bbox='+long+'%2C'+lat+'%2C'+long+'%2C'+lat+'&marker='+lat+'%2C'+long+'&layers=ND';
}

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
