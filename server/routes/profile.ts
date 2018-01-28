import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import authenticate from '../middlewares/authentication';
import { User } from '../models/user';

class ProfileRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    view(req: Request, res: Response, next: NextFunction) {
        let username = req.params.username  || req.body.username;
        User.findOne({username: username})
        .then( user => {
            if(user === null) { 
                res.sendStatus(404);
            } else {
                res.json(user.toObject());
            }
        })
        .catch( err => {
            console.error(err);
        })
    }

    init() {
        this.router.get('/', authenticate, this.view);
        this.router.get('/:username', this.view);
    }

}

export default new ProfileRouter().router;