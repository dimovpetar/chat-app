import { Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
    username: String,
    password: String,
    email: String,
    friendList: [{type: Schema.Types.ObjectId, ref: 'User'}],
    friendRequests: [{type: Schema.Types.ObjectId, ref: 'User'}],
    chatRooms: [{type: Schema.Types.ObjectId, ref: 'ChatRoom'}],
    createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
    if(!this.nickname) {
        this.nickname = this.email;
    }
    next();
});

UserSchema.methods.isFriend = function(id: Schema.Types.ObjectId): boolean {
    return (this.friendList.indexOf(id)) >= 0;
}; 


