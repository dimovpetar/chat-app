import { Router, Request, Response, NextFunction } from 'express';
import authenticate from '../middlewares/authentication';
import socket from '../socket';
import { Op } from 'sequelize';
import { User, ChatRoom, ChatRoomMembers, ChatMessage } from '../models';
import { IUser } from '../../shared/interfaces/user';
import { Update, IChatRoom, IChatMessage } from '../../shared/interfaces/chatroom';

class ChatRoomRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    create(req: Request, res: Response, next: NextFunction) {
        let chatRoomRef, userRef;

        ChatRoom.create()
        .then(chatRoom => {
            chatRoomRef = chatRoom;
            return User.findOne({ where: { username: req.body.username } });
        })
        .then((user: IUser) => {
            userRef = user;
            return chatRoomRef.addMember(user, { through: { lastActive: new Date() } });
        })
        .then(() => {
            return chatRoomRef.getMembers();
        })
        .then((members) => {
            socket.newRoomTo(userRef.username, {
                id: chatRoomRef.id,
                members: members,
                title: chatRoomRef.title,
                lastSeen: new Date(),
                unseenCount: 0,
                picture: chatRoomRef.picture
            });
            res.status(201).json({});
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
    }

    private updateMembership(req: Request, res: Response, next: NextFunction) {
        const roomId = req.params.chatroomId;
        let chatRef;

        User.findOne({ where: { username: req.body.user.username}})
        .then( (user: any) => {

            switch (req.body.update) {
                case Update.RemoveUser:
                    user.removeChatroom(roomId)
                    .then( () => {
                        return ChatRoom.findOne({ where: { id: roomId }});
                    })
                    .then( chat => {
                        chatRef = chat;
                        return chat.getMembers();
                    })
                    .then( (members: IUser[]) => {
                        if (members.length === 0 ) {
                            chatRef.destroy();
                            ChatMessage.destroy( {where : { chatRoomId: roomId }});
                        }

                        socket.updateChat({
                            update: Update.RemoveUser,
                            roomId: roomId,
                            user: {
                                id: user.id,
                                username: user.username
                            }
                        });
                        res.status(201).json({});
                    })
                    .catch( err => {
                        console.log(err);
                        res.sendStatus(503);
                    });
                    break;

                case  Update.AddUser:
                    user.addChatroom(roomId, {
                       through: { lastActive: new Date() }
                    })
                    .then( () => {
                        return ChatRoom.findOne({ where: { id: roomId}});
                    })
                    .then( (chat) => {
                        socket.newRoomTo(user.id, {
                            id: chat.id,
                            title: chat.title,
                            lastSeen: new Date(),
                            unseenCount: 0,
                            picture: chat.picture
                        });
                        socket.updateChat({
                            update: Update.AddUser,
                            roomId: roomId,
                            user: {
                                username: user.username,
                                email: user.email,
                                profilePicture: user.profilePicture
                            }
                        });
                        res.status(201).json({});
                    })
                    .catch( err => {
                        console.log(err);
                        res.sendStatus(503);
                    });
                    break;

                default:
                    res.sendStatus(503);
            }
        })
        .catch( err => {
            console.log(err);
            res.sendStatus(500);
        });
    }

    private updateChatRoom(req: Request, res: Response, next: NextFunction) {
        const roomId = +req.params.chatroomId;

        ChatRoom.update( {title: req.body.title}, {
            where: { id: roomId }
        })
        .then( () => {
            socket.updateChat({
                update: Update.Title,
                roomId: roomId,
                title: req.body.title
            });
            res.status(200).json({});
        })
        .catch( err => {
            console.log(err);
            res.sendStatus(503);
        });
    }

    private list(req: Request, res: Response, next: NextFunction) {

        User.findOne({ where: { id: req.body.id} })
        .then( (user: any) => {
            return user.getChatrooms({ through: { attributes: ['lastActive']} });
        })
        .then( (rooms: any[]) => {
            res.json(rooms);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        });
    }

    private listMembers(req: Request, res: Response, next: NextFunction) {
        const roomId = req.params.chatroomId;

        ChatRoom.findOne({
            where: { id: roomId },
            include: [{
                model: User,
                as: 'members',
                attributes: [ 'username', 'id', 'email', 'profilePicture']
            }]
        })
        .then( (chatRoom: IChatRoom) => {
            res.status(200).json(chatRoom.members);
        })
        .catch( err => {
            console.log(err);
            res.sendStatus(500);
        });

    }

    private findMessages (req: Request, res: Response, next: NextFunction) {
        const date = new Date(req.query.date);
        const roomId = req.params.chatroomId;

        ChatMessage.findAll({
            where: { [Op.and]: [
                    { chatRoomId: roomId },
                    { createdAt: { [Op.lt]: date } }
                ]
            },
            limit: 20,
            order: [
                [ 'createdAt', 'DESC']
            ]
        })
        .then((messages: IChatMessage[]) => {
            res.json(messages.reverse());
        })
        .catch( err => {
            console.error(err);
            res.status(500).json([]);
        });
    }

    init(): void {
        this.router.get('/', authenticate, this.list);
        this.router.get('/members/:chatroomId', this.listMembers);
        this.router.post('/', authenticate, this.create);
        this.router.put('/membership/:chatroomId', authenticate, this.updateMembership);
        this.router.put('/:chatroomId', authenticate, this.updateChatRoom);
        this.router.get('/:chatroomId', authenticate, this.findMessages);
    }
}

export default new ChatRoomRouter().router;
