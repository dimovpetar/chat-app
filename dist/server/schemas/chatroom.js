"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
exports.ChatRoomSchema = new mongoose_1.Schema({
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    title: String,
    messages: [String],
    createdAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=chatroom.js.map