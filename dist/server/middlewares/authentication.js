"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var App_1 = require("../App");
function authenticate(req, res, next) {
    var token = req.headers['authorization'].toString().replace('Bearer ', '');
    if (token) {
        jwt.verify(token, App_1.default.get('superSecret'), function (err, decoded) {
            if (err) {
                res.sendStatus(401); // token expired
            }
            else {
                req.body.username = decoded.username;
                req.body.id = decoded.id;
                next();
            }
        });
    }
    else {
        res.sendStatus(401);
    }
}
exports.default = authenticate;
//# sourceMappingURL=authentication.js.map