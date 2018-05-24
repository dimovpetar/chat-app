import { STRING, INTEGER, UUID, UUIDV4 } from 'sequelize';
import db from '../db';
import { ChatRoom } from '.';

export const ChatMessage = db.sequelize.define('chat_message', {
    id: {
        type: UUID, primaryKey: true, defaultValue: UUIDV4
    },
    text: {
        type: STRING
    },
    sender: {
        type: STRING, allowNull: false
    },
    senderProfilePicture: {
        type: STRING
    },
    messageType: {
        type: STRING
    }
});

ChatMessage.belongsTo(ChatRoom);

ChatMessage.sync()
    .then(() => console.log('chat_messages table synced'))
    .catch((err) => console.log(err));
