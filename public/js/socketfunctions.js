var socket = io.connect();
var connected = false;
jwt = localStorage.getItem('jwt');
if(jwt != undefined) {
    socket.on('connect', function () {
        socket
            .emit('authenticate', {token: jwt}) //send the jwt
            .on('authenticated', function () {
                connected = true;
            })
            .on('unauthorized', function (msg) {
                console.log("unauthorized: " + JSON.stringify(msg.data));
                throw new Error(msg.data.type);
            })
    });
}
