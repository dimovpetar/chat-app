import { IUser } from './user';

export interface IChatRoom {
    id: any;
    members: IUser[];
    messages?: string[];
    title: string;
}

export interface IChatMessage {
    roomId: string;
    message: string;
    sender: string;
}

export interface IChatUpdate {
    update: Update;
    roomId: number;
    user?: IUser;
    title?: string;
}

export enum Update {
    AddUser,
    RemoveUser,
    Title
}

export interface IChatHash {
    [key: string]: IChatMessage[];
}

