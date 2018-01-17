import { Router, Request, Response, NextFunction } from 'express';
import { User, IUserModel } from '../models/user';
import * as jwt from 'jsonwebtoken';
import app from '../App';


export default function authenticate(req: Request, res: Response, next: NextFunction) {

    //var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    var token1 = req.headers['authorization'].toString().replace('Bearer ', '');
    if (token1) {
        jwt.verify(token1, app.get('superSecret'), (err: any, decoded: any) => {
            if (err) {  
                res.sendStatus(401); // token expired 
            } else {

                // if everything is good, save to request for use in other routes
                req.body.username = decoded.username;
                req.body.id = decoded.id;
                
                next();
            }
        });
    } else {
        res.sendStatus(401);
    }
}
