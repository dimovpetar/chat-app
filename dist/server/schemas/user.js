"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    username: String,
    password: String,
    email: String,
    chatRooms: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'ChatRoom' }],
    createdAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=user.js.map