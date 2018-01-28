"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authentication_1 = require("../middlewares/authentication");
var user_1 = require("../models/user");
var ProfileRouter = /** @class */ (function () {
    function ProfileRouter() {
        this.router = express_1.Router();
        this.init();
    }
    ProfileRouter.prototype.view = function (req, res, next) {
        var username = req.params.username || req.body.username;
        user_1.User.findOne({ username: username })
            .then(function (user) {
            if (user === null) {
                res.sendStatus(404);
            }
            else {
                res.json(user.toObject());
            }
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    ProfileRouter.prototype.init = function () {
        this.router.get('/', authentication_1.default, this.view);
        this.router.get('/:username', this.view);
    };
    return ProfileRouter;
}());
exports.default = new ProfileRouter().router;
//# sourceMappingURL=profile.js.map