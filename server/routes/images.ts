import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as multer from 'multer';
import * as fs from 'fs-extra';
import authenticate from '../middlewares/authentication';
import { User } from '../models/user';
import { ChatRoom } from '../models/chatroom';
import socket from '../socket';
import { Update } from '../../shared/interfaces/chatroom';

const env = process.env.NODE_ENV || 'dev';
let DIR;
if (env === 'dev') {
    DIR = '/home/petar/mean-chat-app/client/assets/images/';
} else {
    DIR = path.join(__dirname, '../../public/assets/images/');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
      cb(null,  file.originalname );
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

        uploadImage.single('image')( req, res, function (err) {
            if (err) {
                 console.log(err);
                 return res.status(422).send('an Error occured');
            }
            const filename = req.file.filename;
            console.log(DIR  + filename);
            fs.move(DIR + filename, DIR + 'user' + '/' + filename, {overwrite: true}, function (err1) {
                if (err1) {
                    return console.error(err1);
                }
            });
            User.changeProfilePicture(username, filename);
            return res.json({
                filename: filename
            });
        });
    }

    chatImage(req: Request, res: Response, next: NextFunction) {
        const roomId = req.params.chatroomId;
        uploadImage.single('image')( req, res, function (err) {
            if (err) {
                 console.log(err);
                 return res.status(422).send('an Error occured');
            }
            const filename = req.file.filename;
             console.log(DIR  + filename);
            fs.move(DIR + filename, DIR + 'chat' + '/' + filename, {overwrite: true}, function (err1) {
                if (err1) {
                    return console.error(err1);
                }
                ChatRoom.changePicture(roomId, filename);
                socket.updateChat({
                    update: Update.Picture,
                    roomId: roomId,
                    picture: filename
                });
                return res.json({
                    filename: filename
                });
            });
        });
    }

    init(): void {
        this.router.post('/user', authenticate, this.userImage);
        this.router.post('/chat/:chatroomId', authenticate, this.chatImage);
    }
}

export default new ImageRouter().router;
