//console.log('..env from config.js : ' + process.env.NODE_ENV);

var local = {
    environment: 'local',
    server: 'localhost',
    port: 3000
};

var sandbox = {
    environment: 'sandbox',
    server: 'sandboxURL',
    port: 80
};

if (process.env.NODE_ENV === 'local') {
    exports.config = local;
}
else {
    exports.config = local;
}
