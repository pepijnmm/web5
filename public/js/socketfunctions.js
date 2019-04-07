var socket = io.connect();
var connected = false;
chat =$('#chat');
url = decodeURI(location.pathname).split('/').pop();
if(url == ''){
    url = decodeURI(location.pathname).split('/')[decodeURI(location.pathname).split('/').length-2];
}
if(chat.length > 0) {
    socket.on(url+'_waypoint', function (data) {
        chat.append('<p>'+data+'</p>');
    });
    socket.on('amountUser', function (data) {
        chat.append('<p>'+data+' person(en) hebben tot nu toe een van de kroegen bij deze race bezocht</p>');
    });
}
function socketaskuseramount()
{
    socket.emit('amount users', url);
}
