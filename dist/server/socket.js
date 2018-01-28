"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketIo = require("socket.io");
var sequenceNumberByClient = new Map();
var Socket = /** @class */ (function () {
    function Socket() {
    }
    Socket.prototype.setServer = function (http) {
        this.io = socketIo(http);
        this.settings();
        console.log('SocketIO initialized');
    };
    Socket.prototype.settings = function () {
        var _this = this;
        this.io.on('connection', function (socket) {
            console.log("User connected");
            socket.on('init', function (username) {
                sequenceNumberByClient.set(username, socket);
            });
            socket.on('subscribe', function (room) {
                socket.join(room);
            });
            socket.on('unsubscribe', function (room) {
                socket.leave(room);
            });
            socket.on('message', function (message) {
                _this.io.sockets.in(message.roomId).emit('message', message);
            });
            socket.on('disconnect', function () {
                for (var _i = 0, _a = Array.from(sequenceNumberByClient.entries()); _i < _a.length; _i++) {
                    var _b = _a[_i], username = _b[0], s = _b[1];
                    if (s === socket) {
                        sequenceNumberByClient.delete(username);
                        console.log('user ', username, ' disconnected');
                        break;
                    }
                }
            });
        });
    };
    Socket.prototype.newRoomTo = function (user, room) {
        var s = sequenceNumberByClient.get(user.username);
        if (s) {
            s.join(room.id);
            s.emit('newRoom', room);
        }
    };
    Socket.prototype.updateChat = function (update) {
        this.io.sockets.in(update.roomId.toString()).emit('updateChatRoom', update);
    };
    return Socket;
}());
exports.default = new Socket();
//# sourceMappingURL=socket.js.map