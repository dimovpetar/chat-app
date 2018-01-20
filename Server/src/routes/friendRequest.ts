import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import authenticate from '../middlewares/authentication';
import { ChatRoom, IChatRoomModel } from '../models/chatroom';
import { User } from '../models/user';
import { createChat } from '../helpers/chatroom'

import Socket from '../socket';

class FriendRequestRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    list(req: Request, res: Response, next: NextFunction) {
        const username = req.body.username;
      
        User.findOne({username: username}).populate('friendRequests', 'username')
        .then(user => {       
            res.json(user.friendRequests);
        }) 
        .catch( err => console.error(err));
    }

    handleFriendship(req: Request, res: Response, next: NextFunction) {
        const receiver = {
            id: req.body.id,
            username: req.body.username
        }
        
        const sender = {
            id: req.body.senderId,
            username:  req.body.senderUsername
        }
        
        const decision = req.body.decision;
      
        User.findOneAndUpdate({_id: receiver.id}, { $pull : {'friendRequests':  sender.id}})
        .exec()
        .then( user => {
            if (decision === 'accept') {
                createChat([receiver, sender], [])
                .then( chat => {
                    user.update({ $push: {'friendList': sender.id}}).exec();
                    user.update({ $push: {'chatRooms': chat._id}}).exec();
                    User.update({_id: sender.id}, { $push: {'friendList': receiver.id}}).exec();
                    User.update({_id: sender.id}, { $push: {'chatRooms': chat._id}}).exec();
                    Socket.newRoomTo(receiver.username, {_id: chat._id, title: chat.title});
                    Socket.newRoomTo(sender.username, {_id: chat._id, title: chat.title});          
                })       
            } 
        })
        .then( () => res.status(200).json({status: 'handled'}))
        .catch( err => {
            console.error(err);
            res.status(500);
        })
    }

    invite(req: Request, res: Response, next: NextFunction) {
        const senderId = req.body.id;
        const receiver = req.params.username;
      
        const conditions = {
            username: receiver,
            'friendRequests': { $ne: senderId},
            'friendList' : { $ne: senderId }
        }
        User.update(conditions, {$push: {'friendRequests': senderId}}, (err, user) => {
            if (err) {
             console.log(err);
             res.status(404);
            } else {
                Socket.newFriendRequestTo(receiver);
                res.status(200).json({status: 'Friend request sent'});
            }
        });
    }

    init() {
        this.router.get('/', authenticate, this.list);
        this.router.post('/', authenticate, this.handleFriendship);  
        this.router.post('/:username', authenticate, this.invite);   
    }

}

export default new FriendRequestRouter().router;