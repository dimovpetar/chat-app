import { IUserModel } from '../models/user';

export interface IChatRoom {
    admins: IUserModel[],
    participants: IUserModel[],
    title: string,
    messages: string[]
}

export interface Chat {
    title: string;
    _id: number;
}

export interface IChatMessage {
    roomId: string;
    message: string;
    sender: string;
}
