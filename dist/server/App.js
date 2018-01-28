"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var logger = require("morgan");
var dotenv = require("dotenv");
var mongoose = require("mongoose");
var home_1 = require("./routes/home");
var register_1 = require("./routes/register");
var login_1 = require("./routes/login");
var chatroom_1 = require("./routes/chatroom");
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        this.config();
        this.routes();
    }
    App.prototype.config = function () {
        dotenv.load({ path: '.env' });
        this.express.set('port', (process.env.PORT || 3000));
        this.express.use('/', express.static(path.join(__dirname, '../public')));
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.set('superSecret', 'secret');
        mongoose.connect(process.env.MONGODB_TEST_URI, {
            autoReconnect: true
        });
        mongoose.Promise = global.Promise;
        mongoose.connection.on('error', function (error) { console.error(error); mongoose.disconnect(); });
        mongoose.connection.on('connected', function () { return console.log('Connected to MongoDB'); });
        mongoose.connection.on('disconnected', function () { return console.log('Disconnected from MongoDB'); });
    };
    App.prototype.routes = function () {
        this.express.use('/', home_1.HomeRouter);
        this.express.use('/api/register', register_1.default);
        this.express.use('/api/login', login_1.default);
        this.express.use('/api/chatroom', chatroom_1.default);
        /*this.express.use('/profile', ProfileRouter);*/
        /*this.express.use('/user', FriendRequestRouter)*/
    };
    return App;
}());
exports.default = new App().express;
//# sourceMappingURL=App.js.map