"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_1 = require("../models/user");
var jwt = require("jsonwebtoken");
var LoginRouter = /** @class */ (function () {
    function LoginRouter() {
        this.router = express_1.Router();
        this.init();
    }
    LoginRouter.prototype.login = function (req, res, next) {
        user_1.User.findOne({ username: req.body.username }, function (err, user) {
            if (err) {
                res.status(503).send('Please, try again later');
                next();
            }
            // no such a user
            if (user === null) {
                res.status(401).send('Invalid email or password');
                next();
            }
            else {
                if (req.body.password === user.password) {
                    var payload = {
                        username: user.username,
                        email: user.email,
                        id: user._id
                    };
                    var token = jwt.sign(payload, 'secret', {
                        expiresIn: '1h',
                    });
                    res.status(200).json({
                        authToken: token,
                        username: user.username
                        // expiresIn:
                    });
                }
                else {
                    res.status(401).send('Invalid email or password');
                }
            }
        });
    };
    LoginRouter.prototype.init = function () {
        this.router.post('/', this.login);
    };
    return LoginRouter;
}());
exports.default = new LoginRouter().router;
//# sourceMappingURL=login.js.map