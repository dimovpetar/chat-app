import { Router, Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as multer from 'multer';
import authenticate from '../middlewares/authentication';
import { User } from '../models/user';

const env = process.env.NODE_ENV || 'dev';
let DIR;
if (env === 'dev') {
    DIR = '/home/petar/mean-chat-app/client/assets/images/profile';
} else {
    DIR = path.join(__dirname, '../../public/assets/images/profile');
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

    avatar(req: Request, res: Response, next: NextFunction) {
        uploadImage.single('image')( req, res, function (err) {
            if (err) {
                 console.log(err);
                 return res.status(422).send('an Error occured');
            }
            const filename = req.file.filename;
            User.changeProfilePicture(req.body.username, filename);
            return res.json({
                filename: filename
            });
        });
    }

    init(): void {
        this.router.post('/avatar', authenticate, this.avatar);
    }
}

export default new ImageRouter().router;
