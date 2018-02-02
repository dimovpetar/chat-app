import { IUser } from './user';

export interface IChatRoom {
    id: any;
    members: IUser[];
    messages?: IChatMessage[];
    title: string;
    lastSeen: Date;
    unseenCount: number;
}

export interface IChatMessage {
    roomId: number;
    text: string;
    sender: string;
    sentAt: Date;
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

