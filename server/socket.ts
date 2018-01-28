import * as socketIo from 'socket.io';
import { Server } from 'http';
import { IChatMessage, IChatUpdate, IChatRoom } from '../shared/interfaces/chatroom';
import { IUser } from '../shared/interfaces/user';

const  sequenceNumberByClient = new Map();

class Socket {
    private io: SocketIO.Server;

    constructor() { }

    public setServer(http: Server) {
        this.io = socketIo(http);
        this.settings();
        console.log('SocketIO initialized');
    }

    settings() {
       this.io.on('connection', socket => {
        console.log(`User connected`);

        socket.on('init', username => {
            sequenceNumberByClient.set(username, socket);
        });

        socket.on('subscribe', function(room) {
            socket.join(room);
        });

        socket.on('unsubscribe', function(room) {
            socket.leave(room);
        });

        socket.on('message', (message: IChatMessage) => {
            this.io.sockets.in(message.roomId).emit('message', message);
        });

        socket.on('disconnect', function() {
            for (const [username, s] of Array.from(sequenceNumberByClient.entries())) {
                if (s === socket) {
                    sequenceNumberByClient.delete(username);
                    console.log('user ', username, ' disconnected');
                    break;
                }
            }
        });

       });
    }

    newRoomTo(user: IUser, room: IChatRoom) {
        const s = sequenceNumberByClient.get(user.username);
        if (s) {
           s.join(room.id);
           s.emit('newRoom', room);
        }
    }

    updateChat(update: IChatUpdate) {
        this.io.sockets.in(update.roomId.toString()).emit('updateChatRoom', update);
    }

}

export default new Socket();
