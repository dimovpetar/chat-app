import { ChatRoom } from '../models/chatroom';
import { IUserModel, User } from '../models/user';
import { Chat } from '../interfaces/chatroom';

import  Socket from '../socket';

export const createChat = function(admins: any[], participants: IUserModel[]) {
    const chatRoom = new ChatRoom({
        title: admins[0].username + ' ' + admins[1].username
    });

    admins.forEach( e => {
        chatRoom.admins.push(e.id);
    })

    participants.forEach( e => {
        chatRoom.admins.push(e);
    })

    return chatRoom.save(); 
    /*.then( saved => {
        return saved._id;
    })
    .catch( err => {
        console.error(err);
    })*/
}

export const getUserChats = (username: string): Promise<any[]> => {

    return User.findOne({username: username})
    .then(user => {
        return user.chatRooms;
    })
    .catch( err => {
        console.error(err)
        return [];
    });
}

export const newChatRoom = (chat: Chat) => {
    Socket.gosho();    
    // Socket.io.emi
    //import map from socket
    // map[id]emit(newchat)
}