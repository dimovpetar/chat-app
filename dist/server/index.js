"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var App_1 = require("./App");
var socket_1 = require("./socket");
var server = http.createServer(App_1.default);
socket_1.default.setServer(server);
server.listen(App_1.default.get('port'));
server.on('error', onError);
server.on('listening', onListening);
/*function normalizePort(val: number|string): number|string|boolean {
  const port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}*/
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = (typeof App_1.default.get('port') === 'string') ? 'Pipe ' + App_1.default.get('port') : 'Port ' + App_1.default.get('port');
    switch (error.code) {
        case 'EACCES':
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    var addr = server.address();
    var bind = (typeof addr === 'string') ? "pipe " + addr : "port " + addr.port;
    console.log("Server listening on " + bind);
}
//# sourceMappingURL=index.js.map