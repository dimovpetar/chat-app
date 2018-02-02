import * as socketIo from 'socket.io';
import { Server } from 'http';
import { IChatMessage, IChatUpdate, IChatRoom } from '../shared/interfaces/chatroom';
import { IUser } from '../shared/interfaces/user';
import { User } from './models/user';
import { ChatRoom } from './models/chatroom';

const Clients = new Map();

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
            Clients.set(username, socket);
        });

        socket.on('subscribe', function(room) {
            socket.join(room);
        });

        socket.on('unsubscribe', function(room) {
            socket.leave(room);
        });

        socket.on('message', (message: IChatMessage) => {
            this.io.sockets.in(message.roomId.toString()).emit('message', message);
            ChatRoom.saveMessage(message);
        });

        socket.on('lastSeen', (username: string, roomId: number, date: Date) => {
            User.lastSeen(username, roomId, date);
        });

        socket.on('disconnect', function() {
            for (const [username, s] of Array.from(Clients.entries())) {
                if (s === socket) {
                    Clients.delete(username);
                    User.lastActiveAt(username, Date.now());
                    console.log('user ', username, ' disconnected');
                    break;
                }
            }
        });

       });
    }

    newRoomTo(user: IUser, room: IChatRoom) {
        const s = Clients.get(user.username);
        if (s) {
           s.emit('newRoom', room);
        }
    }

    updateChat(update: IChatUpdate) {
        this.io.sockets.in(update.roomId.toString()).emit('updateChatRoom', update);
    }

}

export default new Socket();
