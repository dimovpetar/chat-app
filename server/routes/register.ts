import { Router, Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user';

class RegisterRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    register(req: Request, res: Response, next: NextFunction) {

        User.findOrCreate({
            where: {username: req.body.username},
            defaults: {
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10)
            }
        })
        .then(result => {
            const [user, wasCreated] = result;
            if (wasCreated === true) {
                res.status(201).json({ msg: 'Registration successful'});
                next();
            } else {
                res.status(401).send('Username is taken');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(503).send('Please, try again later');
            // to do: message validation errors
            next();
        });
    }

    init(): void {
        this.router.post('/', this.register);
    }
}

export default new RegisterRouter().router;
