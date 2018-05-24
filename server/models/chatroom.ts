import { STRING, UUID, DATE, UUIDV4 } from 'sequelize';
import db from '../db';
import { User } from './user';

export const ChatRoom = db.sequelize.define('chatroom', {
    id: {
        type: UUID, primaryKey: true, defaultValue: UUIDV4
    },
    title: {
        type: STRING, defaultValue: 'Enter room title'
    },
    picture: {
        type: STRING, defaultValue: 'assets/images/chat/chatroomDefault.jpg'
    }
});

export const ChatRoomMembers = db.sequelize.define('chatroom_member', {
    lastActive: {
        type: DATE
    }
});


User.belongsToMany(ChatRoom, { through: ChatRoomMembers});
ChatRoom.belongsToMany(User, { through: ChatRoomMembers, as: 'members'});

ChatRoom.sync()
.then(() => console.log('chatroom table synced'))
.catch((err) => console.log(err));


ChatRoomMembers.sync()
    .then(() => console.log('chatroom_members table synced'))
    .catch((err) => console.log(err));
