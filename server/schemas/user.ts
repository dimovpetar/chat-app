import { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
    username: String,
    password: String,
    email: String,
    chatRooms: [{type: Schema.Types.ObjectId, ref: 'ChatRoom'}],
    createdAt: { type: Date, default: Date.now }
});



