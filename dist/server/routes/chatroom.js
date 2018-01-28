"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authentication_1 = require("../middlewares/authentication");
var chatroom_1 = require("../models/chatroom");
var user_1 = require("../models/user");
var chatroom_2 = require("../../shared/interfaces/chatroom");
var socket_1 = require("../socket");
var ChatRoomRouter = /** @class */ (function () {
    function ChatRoomRouter() {
        this.router = express_1.Router();
        this.init();
    }
    ChatRoomRouter.prototype.create = function (req, res, next) {
        var chatId;
        var user1;
        console.log('asdasd');
        user_1.User.findOne({ _id: req.body.id })
            .then(function (user) {
            var chat = new chatroom_1.ChatRoom({ title: 'Enter title' });
            chat.members.push(user._id);
            user.chatRooms.push(chat._id);
            chatId = chat._id;
            user1 = user;
            return Promise.all([user.save(), chat.save()]);
        })
            .then(function (_) {
            chatroom_1.ChatRoom.findOne({ _id: chatId }).populate([{ path: 'members', select: 'username' }])
                .exec()
                .then(function (chat) {
                socket_1.default.newRoomTo(user1, {
                    id: chat._id,
                    members: chat.members,
                    title: chat.title
                });
            });
            res.status(201).json({});
        })
            .catch(function (err) { return console.error(err); });
    };
    ChatRoomRouter.prototype.update = function (req, res, next) {
        var roomId = req.params.chatroomId;
        if (req.body.update === chatroom_2.Update.RemoveUser) {
            chatroom_1.ChatRoom.update({ _id: roomId }, { $pull: { 'members': req.body.id } })
                .then(function () {
                return user_1.User.findOneAndUpdate({ _id: req.body.id }, { $pull: { 'chatRooms': roomId } });
            })
                .then(function (user) {
                socket_1.default.updateChat({
                    update: chatroom_2.Update.RemoveUser,
                    roomId: roomId,
                    user: {
                        username: user.username,
                        email: user.email
                    }
                });
                res.status(201).json({});
            })
                .catch(function (err) {
                console.log('err', err);
                res.status(201).json({});
            });
        }
        else if (req.body.update === chatroom_2.Update.AddUser) {
            var user1_1;
            user_1.User.findOneAndUpdate({
                username: req.body.user.username,
                'chatRooms': { $ne: roomId }
            }, { $push: { 'chatRooms': roomId } })
                .then(function (user) {
                user1_1 = user;
                return chatroom_1.ChatRoom.update({ _id: roomId }, { $push: { 'members': user._id } });
            })
                .then(function (chat) {
                socket_1.default.newRoomTo(user1_1, chat);
                socket_1.default.updateChat({
                    update: chatroom_2.Update.AddUser,
                    roomId: roomId,
                    user: {
                        username: user1_1.username,
                        email: user1_1.email
                    }
                });
                res.status(201).json({});
            })
                .catch(function (err) {
                console.log(err);
                res.status(201).json({});
            });
        }
    };
    ChatRoomRouter.prototype.add = function (req, res, next) {
    };
    ChatRoomRouter.prototype.list = function (req, res, next) {
        user_1.User.findOne({ _id: req.body.id }).populate([
            { path: 'chatRooms', populate: { path: 'members', select: 'username' } },
            { path: 'chatRooms', populate: { path: 'admins', select: 'username' } }
        ])
            .then(function (user) {
            var rooms = [];
            user.chatRooms.forEach(function (room) {
                rooms.push({
                    id: room._id,
                    admins: room.admins,
                    members: room.members,
                    title: room.title,
                });
            });
            res.json(rooms);
        })
            .catch(function (err) { return console.error(err); });
    };
    ChatRoomRouter.prototype.init = function () {
        this.router.get('/', authentication_1.default, this.list);
        this.router.post('/', authentication_1.default, this.create);
        this.router.put('/:chatroomId', authentication_1.default, this.update);
    };
    return ChatRoomRouter;
}());
exports.default = new ChatRoomRouter().router;
// const invites = req.body.invites;
// createChat(req.body.chatTitle, [req.body.id], [])
// .then( chatRoom => {
//     User.findOneAndUpdate({_id: req.body.id}, { $push : {'chatRooms':  chatRoom._id}})
//     .exec()
//     .then( user => {
//         //     chatRoom.populate ([
//         //        { path: 'participants', select: 'username' },
//         //         { path: 'admins',       select: 'username' }])
//         //     console.log(chatRoom);
//         ChatRoom.findOne({_id: chatRoom._id})
//         .populate( [
//             {path: 'participants', select: 'username' },
//             { path: 'admins',       select: 'username' }])
//         .then( chatr => {
//             socket.newRoomTo(user,{
//                 id: chatr._id,
//                 admins: chatr.admins,
//                 participants: chatr.participants,
//                 title: chatr.title,
//             });
//         })
//     })
//     // User.find({ username: {$in: invites}}).cursor()
//     //     .eachAsync( (resUser) => {
//     //     chatRoom.participants.push(resUser._id);
//     //     resUser.chatRooms.push(chatRoom._id)
//     //     socket.newRoomTo(resUser, {id: chatRoom._id, title: chatRoom.title});
//     //     resUser.save();
//     // }, err => err)
//   //  .then( () =>  chatRoom.save() )
// })
// .then( () => res.sendStatus(200))
// .catch( err => console.error(err));
//# sourceMappingURL=chatroom.js.map