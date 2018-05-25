import * as socketIo from 'socket.io';
import { Server } from 'http';
import { IChatMessage, IChatUpdate, IChatRoom } from '../shared/interfaces/chatroom';
import { IUser } from '../shared/interfaces/user';
import { ChatMessage } from './models';

const Clients = new Map();

class ChatSocket {
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

            if (message.messageType === 'image') {
                message.text = 'data:image/jpg;base64,' + new Buffer(message.image).toString('base64');
            }
            this.io.sockets.in(message.roomId.toString()).emit('message', message);
            ChatMessage.create({
                text: message.text,
                sender: message.sender,
                senderProfilePicture: message.senderProfilePicture,
                messageType: message.messageType,
                chatroomId: message.roomId
            });
        });

        socket.on('lastSeen', (username: string, roomId: number, date: Date) => {
           // User.lastSeen(username, roomId, date);
        });

        socket.on('disconnect', function() {
            for (const [username, s] of Array.from(Clients.entries())) {
                if (s === socket) {
                    Clients.delete(username);
                 //   User.lastActiveAt(username, Date.now());
                    console.log('user ', username, ' disconnected');
                    break;
                }
            }
        });

       });
    }

    newRoomTo(username: string, room: IChatRoom) {
        const s = Clients.get(username);
        if (s) {
           s.emit('newRoom', room);
        }
    }

    updateChat(update: IChatUpdate) {
        this.io.sockets.in(update.roomId.toString()).emit('updateChatRoom', update);
    }

    newProfilePictureTo(username: string, picturePath: string) {
        const s = Clients.get(username);
        if (s) {
           s.emit('newProfilePicture', picturePath);
        }
    }

}

export default new ChatSocket();
