import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import authenticate from '../middlewares/authentication';
import { ChatRoom } from '../models/chatroom';
import { User } from '../models/user';
import { IChatUpdate, Update } from '../../shared/interfaces/chatroom';
import socket from '../socket';
import { IUser } from '../../shared/interfaces/user';

class ChatRoomRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    create(req: Request, res: Response, next: NextFunction) {
        let chatId: any;
        let user1: any;
        console.log('asdasd');
        User.findOne({_id: req.body.id})
        .then( user => {
            const chat = new ChatRoom({title: 'Enter title'});
            chat.members.push(user._id);
            user.chatRooms.push(chat._id);
            chatId = chat._id;
            user1 = user;
            return  Promise.all([user.save(), chat.save()]);
        })
        .then( _ => {
            ChatRoom.findOne({_id: chatId}).populate([{ path: 'members', select: 'username' }])
            .exec()
            .then( chat => {
               socket.newRoomTo(user1, {
                    id: chat._id,
                    members: chat.members,
                    title: chat.title
                });
            });
            res.status(201).json({});
        })
        .catch( err => console.error(err));
    }

    private update(req: Request, res: Response, next: NextFunction) {
        const roomId = req.params.chatroomId;
        if (req.body.update === Update.RemoveUser) {
            ChatRoom.update({_id: roomId}, {$pull: {'members':  req.body.id}})
            .then( () => {
                return User.findOneAndUpdate({_id: req.body.id}, {$pull: {'chatRooms': roomId}});
            })
            .then( (user) => {
               socket.updateChat({
                    update: Update.RemoveUser,
                    roomId: roomId,
                    user: {
                        username: user.username,
                        email: user.email
                    }
                });
                res.status(201).json({});
            })
            .catch( err => {
                console.log('err', err);
                res.status(201).json({});
            });
        } else if ( req.body.update === Update.AddUser) {
            let user1: IUser;
            User.findOneAndUpdate({
                username: req.body.user.username,
                'chatRooms': { $ne: roomId}
            }, {$push: {'chatRooms': roomId}})
            .then( user => {
                user1 = user;
                return ChatRoom.update({_id: roomId}, {$push: {'members':  user._id}});
            })
            .then ( chat => {
                socket.newRoomTo(user1, chat);
                socket.updateChat({
                    update: Update.AddUser,
                    roomId: roomId,
                    user: {
                        username: user1.username,
                        email: user1.email
                    }
                });
                res.status(201).json({});
            })
            .catch ( err => {
                console.log(err);
                res.status(201).json({});
            });
        }
    }


    private add(req: Request, res: Response, next: NextFunction) {

    }

    private list(req: Request, res: Response, next: NextFunction) {
        User.findOne({_id: req.body.id}).populate( [
            {path: 'chatRooms', populate: { path: 'members', select: 'username' }},
            {path: 'chatRooms', populate: { path: 'admins',  select: 'username' }}])
        .then(user => {
            const rooms: any[] = [];
            user.chatRooms.forEach( room => {
                rooms.push({
                    id: room._id,
                    admins: room.admins,
                    members: room.members,
                    title: room.title,
                });
            });
            res.json(rooms);
        })
        .catch( err => console.error(err));
    }

    init(): void {
        this.router.get('/', authenticate, this.list);
        this.router.post('/', authenticate, this.create);
        this.router.put('/:chatroomId', authenticate, this.update);
    }
}

export default new ChatRoomRouter().router;


// const invites = req.body.invites;
        // createChat(req.body.chatTitle, [req.body.id], [])
        // .then( chatRoom => {
        //     User.findOneAndUpdate({_id: req.body.id}, { $push : {'chatRooms':  chatRoom._id}})
        //     .exec()
        //     .then( user => {
        //         //     chatRoom.populate ([
        //         //        { path: 'participants', select: 'username' },
        //         //         { path: 'admins',       select: 'username' }])
        //         //     console.log(chatRoom);

        //         ChatRoom.findOne({_id: chatRoom._id})
        //         .populate( [
        //             {path: 'participants', select: 'username' },
        //             { path: 'admins',       select: 'username' }])
        //         .then( chatr => {
        //             socket.newRoomTo(user,{
        //                 id: chatr._id,
        //                 admins: chatr.admins,
        //                 participants: chatr.participants,
        //                 title: chatr.title,
        //             });
        //         })

        //     })


        //     // User.find({ username: {$in: invites}}).cursor()
        //     //     .eachAsync( (resUser) => {
        //     //     chatRoom.participants.push(resUser._id);
        //     //     resUser.chatRooms.push(chatRoom._id)
        //     //     socket.newRoomTo(resUser, {id: chatRoom._id, title: chatRoom.title});
        //     //     resUser.save();
        //     // }, err => err)
        //   //  .then( () =>  chatRoom.save() )
        // })
        // .then( () => res.sendStatus(200))
        // .catch( err => console.error(err));
