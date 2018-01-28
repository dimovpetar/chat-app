import { Schema } from 'mongoose';
import { UserSchema } from './user';

export const ChatRoomSchema = new Schema({
    members: [{type: Schema.Types.ObjectId, ref: 'User'}],
    title: String,
    messages: [String],
    createdAt: { type: Date, default: Date.now }
});

