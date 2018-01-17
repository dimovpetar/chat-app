import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
import * as jwt from 'jsonwebtoken';
import app from '../App';

class LoginRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    login(req: Request, res: Response, next: NextFunction) {      

        User.findOne({ username: req.body.username }, (err, user) => {
            if (err) {              
                res.status(503).send('Please, try again later');
                next();
            }
            // no such a user 
            if (user === null) {        
                res.status(401).send('Invalid email or password');
                next();    
            } else {
                if (req.body.password === user.password) {

                    const payload = {
                        username: user.username,
                        email: user.email,
                        id: user._id
                    }

                    const token = jwt.sign( payload, 'secret' , {        
                        expiresIn: '1h',   
                    });

                    res.status(200).json({
                        authToken: token, 
                        //expiresIn:
                        username: user.username
                    });

                } else {
                    res.status(401).send('Invalid email or password');
                }
            }
        });
    }

    init(): void {
        this.router.post('/', this.login);
    }
}

export default new LoginRouter().router;