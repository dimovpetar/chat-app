"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_1 = require("../models/user");
var RegisterRouter = /** @class */ (function () {
    function RegisterRouter() {
        this.router = express_1.Router();
        this.init();
    }
    RegisterRouter.prototype.register = function (req, res, next) {
        var user = new user_1.User(req.body);
        user_1.User.findOne({ username: user.username }, function (err, result) {
            if (err) {
                res.status(503).send('Please, try again later');
                next();
            }
            if (result === null) {
                // success to register
                user.save();
                res.status(201).json({ msg: 'Registration successful' });
                next();
            }
            else {
                res.status(401).send('Username is taken');
            }
        });
    };
    RegisterRouter.prototype.init = function () {
        this.router.post('/', this.register);
    };
    return RegisterRouter;
}());
exports.default = new RegisterRouter().router;
//# sourceMappingURL=register.js.map