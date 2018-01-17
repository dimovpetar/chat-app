import * as socketIo from 'socket.io'; 
import { Server } from 'http';
import { getUserChats } from './helpers/chatroom';

class Socket {
    public io: SocketIO.Server

    constructor() {
        console.log('napravih nov soket')
    }
    public gosho() {
        console.log('gosho')
    }

    public setServer(http: Server) {
        this.io = socketIo(http);
        this.settings();
        console.log('SocketIO initialized');    
    }

    get socket(): SocketIO.Server {
        return this.io;
    }
    
    settings() {    
       this.io.on('connection', socket => {
        console.log(`User connected`);

        socket.on('disconnect', function() {
            console.log('user disconnected');
        });

        socket.on('message', (chatMessage) => {
            console.log("Message Received: " + chatMessage.message);
            this.io.emit('message', chatMessage);    
        });
       });
    }

}

export default new Socket();

//export new map???

/*
export default function initSocket(http: Server) {
    return new Socket(http);
}*/