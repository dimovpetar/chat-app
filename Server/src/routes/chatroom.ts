import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import authenticate from '../middlewares/authentication';
import { ChatRoom, IChatRoomModel } from '../models/chatroom';
import { User } from '../models/user';
import { createChat} from '../helpers/chatroom'

class ChatRoomRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    create(req: Request, res: Response, next: NextFunction) {
   
        const chatRoom = new ChatRoom({
            admins: [req.body._id],
            messages: ['Zdrasti', ':)'],
            title: req.body.chatTitle
        });

        const emails = req.body.emails; //['petsata@abv.bg', 'polqka@abv.bg'];
        
        User.findOneAndUpdate({_id: req.body._id}, { $push : {'chatRooms':  chatRoom._id}}).exec();
        User.find({ email: {$in: emails}}).cursor().eachAsync( (resUser) => {
            if ( resUser.isFriend(req.body._id)) {
                chatRoom.participants.push(resUser._id);
                resUser.chatRooms.push(chatRoom._id)
                resUser.save();
            }
        }, err => err)
        .then( () =>  chatRoom.save() )
        .then( () => res.sendStatus(200))
        .catch( err => console.error(err));
    }

    private list(req: Request, res: Response, next: NextFunction) {
        User.findOne({_id: req.body.id}).populate('chatRooms', 'title')
        .then(user => {
            res.json(user.chatRooms);
        })
        .catch( err => console.error(err));
    }

    init(): void {
        this.router.post('/', authenticate, this.create); //authorize
        this.router.get('/', authenticate, this.list)
    }
}

export default new ChatRoomRouter().router;
