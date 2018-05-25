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
  },
  filename: function (req, file, cb) {
      cb(null,  file.originalname);
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
        console.log(process.env.NODE_ENV);
        const username = req.body.username;
        const userId = req.body.id;

        uploadImage.single('image')( req, res, (err) => {
            if (err) {
                 console.log(err);
                 return res.status(422).send('an Error occured');
            }
            const newFilename = username + '.' + /(?:\.([^.]+))?$/.exec(req.file.filename)[1];

            fs.move(DIR + req.file.filename, DIR + 'user' + '/' + newFilename, { overwrite: true })
            .then( () => {
                User.update( { profilePicture: `assets/images/user/${newFilename}`}, {
                    where: { id: userId }
                });

                res.json({
                    filename: `assets/images/user/${newFilename}`
                });
            })
            .catch( moveError =>  {
                console.log(moveError);
                res.sendStatus(500);
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

            const newFilename = roomId + '.' + /(?:\.([^.]+))?$/.exec(req.file.filename)[1];
            console.log(DIR  + newFilename);
            fs.move(DIR + req.file.filename, DIR + 'chat' + '/' + newFilename, {overwrite: true})
            .then( () => {
                ChatRoom.update( { picture: `assets/images/chat/${newFilename}`}, {
                    where: { id: roomId }
                });

                socket.updateChat({
                    update: Update.Picture,
                    roomId: roomId,
                    picture: newFilename
                });
                res.json({
                    filename: newFilename
                });
            })
            .catch( moveError =>  {
                console.log(moveError);
                res.sendStatus(500);
            });
        });
    }

    init(): void {
       this.router.post('/user', authenticate, this.userImage);
       this.router.post('/chat/:chatroomId', authenticate, this.chatImage);
    }
}

export default new ImageRouter().router;
