var socket = io.connect();
var connected = false;
chat =$('#chat');
if(chat.length > 0) {
    socket.on(decodeURI(location.pathname).split('/').pop()+'_waypoint', function (data) {
        chat.append('<p>'+data+'</p>');
    });
    socket.on('amountUser', function (data) {
        chat.append('<p>'+data+' personen hebben tot nu toe een van de kroegen bij deze race bezocht</p>');
    });
}
function socketaskuseramount()
{
    socket.emit('amount users', decodeURI(location.pathname).split('/').pop());
}
