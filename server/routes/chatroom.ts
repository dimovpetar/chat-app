import { Router, Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
const mongoose = require('mongoose');
import authenticate from '../middlewares/authentication';
import { ChatRoom, IChatRoomModel } from '../models/chatroom';
import { User } from '../models/user';
import { IChatUpdate, Update, IChatRoom } from '../../shared/interfaces/chatroom';
import socket from '../socket';
import { IUser } from '../../shared/interfaces/user';

class ChatRoomRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    create(req: Request, res: Response, next: NextFunction) {
        User.findOne({_id: req.body.id})
        .then( user => {
            const chat = new ChatRoom({title: 'Enter title'});
            chat.members.push(user._id);
            user.chat.push({
                lastSeen: Date.now(),
                room: chat._id
            });
            return  Promise.all([user.save(), chat.save()]);
        })
        .then((arr) => {
            ChatRoom.findOne({_id: arr[1]._id})
            .populate([{ path: 'members', select: 'username profilePicture' }])
            .then( chat => {
               socket.newRoomTo(arr[0], {
                    id: chat._id,
                    members: chat.members,
                    title: chat.title,
                    lastSeen: new Date(),
                    unseenCount: 0,
                    picture: chat.picture
                });
            });
            res.status(201).json({});
        })
        .catch( err => console.error(err));
    }

    private update(req: Request, res: Response, next: NextFunction) {
        const roomId = req.params.chatroomId;

        if (req.body.update === Update.RemoveUser) {
            ChatRoom.findOneAndUpdate({_id: roomId}, {$pull: {'members':  req.body.id}}, {new: true})
            .then( (chat) => {
                if (chat.members.length === 0) {
                    chat.remove();
                    // fs.unlink(chat.picture, (err) => {
                    //     console.log(err);
                    // });
                }
                return User.findOneAndUpdate({_id: req.body.id}, {$pull: {'chat': {room: roomId}}});
            })
            .then( user => {
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
                console.log( err);
                res.status(503).json({});
            });
        } else if ( req.body.update === Update.AddUser) {

            let user1: IUser;
            User.findOneAndUpdate({
                username: req.body.user.username,
                'chat': { $ne: { room: roomId }}
            }, {$push: {'chat': { room: roomId}}})
            .then( user => {
                user1 = user;
                return ChatRoom.findOneAndUpdate({_id: roomId}, {$push: {'members':  user._id}}, {new: true})
                .populate({ path: 'members', select: 'username profilePicture' });
            })
            .then( chat => {
                socket.newRoomTo(user1, {
                    id: chat._id,
                    members: chat.members,
                    title: chat.title,
                    lastSeen: new Date(),
                    unseenCount: 0,
                    picture: chat.picture
                });
                socket.updateChat({
                    update: Update.AddUser,
                    roomId: roomId,
                    user: {
                        username: user1.username,
                        email: user1.email,
                        profilePicture: user1.profilePicture
                    }
                });
                res.status(201).json({});
            })
            .catch ( err => {
                console.log(err);
                res.status(503).json({});
            });
        } else if ( req.body.update === Update.Title) {
            ChatRoom.update({_id: roomId}, {$set: { title: req.body.title }})
            .then( _ => {
                socket.updateChat({
                    update: Update.Title,
                    roomId: roomId,
                    title: req.body.title
                });
            });
        }
    }


    private list (req: Request, res: Response, next: NextFunction) {
        User.findOne({_id: req.body.id})
        .populate({
            path: 'chat.room',
            populate: {
                path: 'members',
                select: 'username profilePicture',
           }
        })
        .then(user => {
            const rooms: IChatRoom[] = [];
            const promises: Promise<any> [] = [];

            user.chat.forEach( el => {
                promises.push(
                    ChatRoom.unseenCount(el.lastSeen, el.room._id)
                    .then( count => {
                        rooms.push({
                            id: el.room._id,
                            members: el.room.members,
                            title: el.room.title,
                            lastSeen: el.lastSeen,
                            unseenCount: count[0].unseenCount,
                            picture: el.room.picture
                        });
                    })
                );
            });
            Promise.all(promises).then( _ => {
                res.json(rooms);
            });
        })
        .catch( err => console.error(err));
    }

    private findMessages (req: Request, res: Response, next: NextFunction) {
        const date = new Date(req.query.date);
        ChatRoom.aggregate([
            { '$match': { _id : mongoose.Types.ObjectId(req.params.chatroomId) } },
            {
                '$project': {
                    'items': {
                        '$filter': {
                            'input': '$messages',
                            'as': 'item',
                            'cond': { '$lte': [ '$$item.sentAt', date ] }
                        }
                    }
                }
            }
        ])
        .then( (raw) => {
            res.json(raw[0].items);
        })
        .catch( err => {
            console.error(err);
            res.json([]);
        });
    }

    init(): void {
        this.router.get('/', authenticate, this.list);
        this.router.post('/', authenticate, this.create);
        this.router.put('/:chatroomId', authenticate, this.update);
        this.router.get('/:chatroomId', authenticate, this.findMessages);
    }
}

export default new ChatRoomRouter().router;
