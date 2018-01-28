import { Router, Request, Response, NextFunction } from 'express';
import { User, IUserModel } from '../models/user';
import * as jwt from 'jsonwebtoken';
import app from '../App';


export default function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'].toString().replace('Bearer ', '');
    if (token) {
        jwt.verify(token, app.get('superSecret'), (err: any, decoded: any) => {
            if (err) {
                res.sendStatus(401); // token expired
            } else {
                req.body.username = decoded.username;
                req.body.id = decoded.id;
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }
}
