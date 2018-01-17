import { Document, Model, model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user';
import { UserSchema } from '../schemas/user';

export interface IUserModel extends IUser, Document {
    isFriend(id: Schema.Types.ObjectId): boolean;
}

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
