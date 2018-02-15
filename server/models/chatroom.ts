import { Document, Model, model } from 'mongoose';
import { IChatRoom } from '../../shared/interfaces/chatroom';
import { ChatRoomSchema } from '../schemas/chatroom';



export interface IChatRoomModel extends  IChatRoom, Document {
    changePicture(): void;
}

export const ChatRoom: Model<IChatRoomModel> = model<IChatRoomModel> ('ChatRoom', ChatRoomSchema);

