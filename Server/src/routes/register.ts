import { Router, Request, Response, NextFunction } from 'express';
import { User, IUserModel } from '../models/user';

class RegisterRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    register(req: Request, res: Response, next: NextFunction) {

        const user = new User(req.body);
        User.findOne({ username: user.username }, (err, result: IUserModel) => {
            if (err) {              
                res.status(503).send('Please, try again later');
                next();
            }

            if(result === null) {
                //success to register
                user.save( );
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

/*         user.save().then(user => { 
            res.json(user.toObject);
            next();
        }).catch(next);*/

//     getOne(req: Request, res: Response, next: NextFunction) {
//         //verify the id parameter exists
//         const PARAM_ID: string = "id";
//         if (typeof req.params[PARAM_ID] === "undefined" || req.params[PARAM_ID] === null) {
//             res.sendStatus(404);
//             next();
//             return;
//         }
    
//         //get the id
//         var id = req.params[PARAM_ID];
    
//         //get authorized user
//         this.authorize(req, res, next).then((user: IUserModel) => {
//         //make sure the user being deleted is the authorized user
//         if (user._id !== id) {
//             res.sendStatus(401);
//             next();
//             return;
//         }
    
//         //log
//         console.log(`[UsersApi.get] Retrieving user: {id: ${req.params.id}}.`);
    
//         //find user
//         User.findById(id).then((user: IUserModel) => {
//             //verify user was found
//             if (user === null) {
//                 res.sendStatus(404);
//                 next();
//                 return;
//             }
    
//             //send json response
//             res.json(user);
//             next();
//         }).catch(next);
//         }).catch(next);
//     }