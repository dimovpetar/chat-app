import { Schema } from 'mongoose';
import { UserSchema } from './user';

export const ChatRoomSchema = new Schema({
    admins: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
    title: String,
    messages: [String],
    createdAt: { type: Date, default: Date.now }
})
