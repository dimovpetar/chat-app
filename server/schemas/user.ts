import { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
    username: String,
    password: String,
    email: String,
    chat: [{
        lastSeen: { type: Date, default: Date.now },
        room: {
            type: Schema.Types.ObjectId, ref: 'ChatRoom'
        }
    }],
    lastActive: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});


UserSchema.statics.lastActiveAt = function lastActiveAt(username: string, date: Date) {
    this.update({username: username}, {$set: {lastActive: date }}).exec();
};

UserSchema.statics.lastSeen = function lastSeen(username: string, roomId: number, date: Date) {
   this.update({
       username: username,
       'chat.room': roomId
   }, { $set: { 'chat.$.lastSeen': date }}).exec();
};
