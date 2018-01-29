import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { User, IUserModel } from '../models/user';

class RegisterRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    register(req: Request, res: Response, next: NextFunction) {

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        User.findOne({ username: user.username }, (err, result: IUserModel) => {
            if (err) {
                res.status(503).send('Please, try again later');
                next();
            }

             // success to register
            if (result === null) {
                user.save();
                res.status(201).json({ msg: 'Registration successful'});
                next();
            } else {
                res.status(401).send('Username is taken');
            }
        });

    }

    init(): void {
        this.router.post('/', this.register);
    }
}

export default new RegisterRouter().router;
