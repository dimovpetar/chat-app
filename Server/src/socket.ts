import * as socketIo from 'socket.io'; 
import { Server } from 'http';
import { getUserChats } from './helpers/chatroom';
import { IChatMessage, Chat } from './interfaces/chatroom';

const  sequenceNumberByClient = new Map();

class Socket {
    private io: SocketIO.Server

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
            this.newRoomTo(username, {_id:5, title: 'test'})
        })

        socket.on('subscribe', function(room) { 
            socket.join(room); 
        })
    
        socket.on('unsubscribe', function(room) {  
            console.log('leaving room', room);
            socket.leave(room); 
        })
   
        socket.on('message', (message: IChatMessage) => {
            this.io.sockets.in(message.roomId).emit('message', message);   
        });

        socket.on('disconnect', function() {
            for(const [username,s] of Array.from(sequenceNumberByClient.entries())) {
                if(s === socket) {
                    sequenceNumberByClient.delete(username);
                    console.log('user ', username,' disconnected');
                    break;
                }
            }
        });
        
       });
    }

    newRoomTo(username: string, room: Chat) {
        const s = sequenceNumberByClient.get(username);
        if (s) {
           s.emit('newRoom', room);
        }
    }

    newFriendRequestTo(username: string) {
        const s = sequenceNumberByClient.get(username);
        if (s) {
            s.emit('newFriendRequest');
        }
    }

}

export default new Socket();