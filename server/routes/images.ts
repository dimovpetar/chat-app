import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as multer from 'multer';
import * as fs from 'fs-extra';
import authenticate from '../middlewares/authentication';
import socket from '../socket';
import { User, ChatRoom } from '../models';
import { Update } from '../../shared/interfaces/chatroom';


const DIR = (process.env.NODE_ENV === 'prod')
        ? path.join(__dirname, '../../public/assets/images/') : path.join(__dirname, '../../../public/assets/images/');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DIR);
    }
});

const uploadImage = multer({ storage: storage });

class ImageRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    userImage(req: Request, res: Response, next: NextFunction) {
        const username = req.body.username;
        const userId = req.body.id;

        uploadImage.single('image')( req, res, (err) => {
            if (err) {
                 console.log(err);
                 return res.status(422).send('an Error occured');
            }

            User.update( { profilePicture: `assets/images/${req.file.filename}`}, {
                where: { id: userId }
            });

            res.json({
                filename: `assets/images/${req.file.filename}`
            });
        });
    }

    chatImage(req: Request, res: Response, next: NextFunction) {
        const roomId = req.params.chatroomId;
        console.log('VLIZA\n\n');

        uploadImage.single('image')( req, res, function (err) {
            if (err) {
                 console.log(err);
                 return res.status(422).send('an Error occured');
            }

            ChatRoom.update( { picture: `assets/images/${req.file.filename}`}, {
                where: { id: roomId }
            });

            socket.updateChat({
                update: Update.Picture,
                roomId: roomId,
                picture: req.file.filename
            });
            res.json({
                filename: req.file.filename
            });
        });
    }

    init(): void {
       this.router.post('/user', authenticate, this.userImage);
       this.router.post('/chat/:chatroomId', authenticate, this.chatImage);
    }
}

export default new ImageRouter().router;
