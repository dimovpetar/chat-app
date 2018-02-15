import { Schema } from 'mongoose';
import { UserSchema } from './user';
import { IChatMessage } from '../../shared/interfaces/chatroom';

export const ChatRoomSchema = new Schema({
    members: [{type: Schema.Types.ObjectId, ref: 'User'}],
    title: String,
    messages: [{
        text: String,
        sender: String,
        senderProfilePicture: String,
        sentAt: { type: Date, default: Date.now }
    }],
    picture: String,
    createdAt: { type: Date, default: Date.now }
});


ChatRoomSchema.statics.saveMessage = function (message: IChatMessage) {
    const chatMessage = {
        text: message.text,
        sender: message.sender,
        sentAt: message.sentAt,
        senderProfilePicture: message.senderProfilePicture
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

ChatRoomSchema.statics.changePicture = function changePicture(id: number, newPicture: string) {
    console.log('asd', newPicture);
    this.update({_id: id}, {$set: {picture: newPicture}}).exec();
};

ChatRoomSchema.pre('save', function(next) {
    if (!this.picture) {
      this.picture = 'chatDefault.jpg';
    }
    next();
});
