import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import { IUser } from '../../shared/interfaces/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

class LoginRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    login(req: Request, res: Response, next: NextFunction) {
        User.findOne({
            where: {username: req.body.username}
        })
        .then((user: IUser) => {
            if (user === null) {
                res.status(401).send('Invalid username or password');
                next();
            } else if (bcrypt.compareSync(req.body.password, user.password)) {

                const payload = {
                    username: user.username,
                    email: user.email,
                    id: user.id
                };

                const token = jwt.sign(payload, 'secret' , {
                    expiresIn: '100h',
                });

                res.status(200).json({
                    authToken: token,
                    username: user.username,
                    profilePicture: user.profilePicture
                    // expiresIn:
                });
            } else {
                res.status(401).send('Invalid username or password');
            }
        })
        .catch( err => {
            res.status(503).send('Please, try again later');
            next();
        });
    }

    init(): void {
        this.router.post('/', this.login);
    }
}

export default new LoginRouter().router;
