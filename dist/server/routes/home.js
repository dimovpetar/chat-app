"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var path_1 = require("path");
exports.HomeRouter = express_1.Router();
exports.HomeRouter.get('/', function (req, res) {
    res.sendFile(path_1.join(__dirname, '../public/index.html'));
});
//# sourceMappingURL=home.js.map