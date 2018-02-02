import { Schema } from 'mongoose';
import { UserSchema } from './user';
import { IChatMessage } from '../../shared/interfaces/chatroom';

export const ChatRoomSchema = new Schema({
    members: [{type: Schema.Types.ObjectId, ref: 'User'}],
    title: String,
    messages: [{
        text: String,
        sender: String,
        sentAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});


ChatRoomSchema.statics.saveMessage = function (message: IChatMessage) {
    const chatMessage = {
        text: message.text,
        sender: message.sender,
        sentAt: message.sentAt
    };
    this.update({_id: message.roomId}, {$push: {messages: chatMessage}}).exec();
};

ChatRoomSchema.statics.unseenCount = function (lastSeen: Date, chatId: number) {
    return this.aggregate([
        { '$match': { _id : chatId } },
        {
            '$project': {
                'unseenCount': {
                    '$size': {
                        '$filter': {
                            'input': '$messages',
                            'as': 'item',
                            'cond': { '$gt': [ '$$item.sentAt', lastSeen ] }
                        }
                    }
                }
            }
        }
    ]);
};
