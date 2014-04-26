var config = require('./config').config;
var server = config.server,
    port = config.port,
    io = require('socket.io-client'),
    socket = io.connect(server, { port: port });    

var rl = require('./utils').readline;

exports.emit = function(command, data) {
    socket.emit(command, data);
};

exports.connected = function() {
//    console.log('...++' + socket.socket.connected);
    if (socket.socket.connected === true) {
        return true;
    }
    else {
        return false;
    }
};

socket.on('connect', function() {
    console.log("... connected to server - " + server + ':' + port);
    rl.prompt();
});

socket.on('ping', function(data) {
    console.log('');
    console.log(data);
});

socket.on('statusUpdate', function(data) {
    console.log('');
    console.log(data.message);
    rl.prompt();
});

/*
socket.on('connecting', function(data) {
    console.log('... connecting');
});
*/

socket.on('error', function(data) {
    console.log(data);
    rl.prompt();

});

if (socket.socket.connected !== true) {
    console.log('... connecting to target environment : ' + config.environment);
}
