import { Document, Model, model, Schema } from 'mongoose';
import { UserSchema } from '../schemas/user';
import { IUser } from '../../shared/interfaces/user';

export interface IUserModel extends IUser, Document {

}

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
