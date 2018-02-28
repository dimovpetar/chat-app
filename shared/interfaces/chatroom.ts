import { IUser } from './user';

export interface IChatRoom {
    id: any;
    members: IUser[];
    messages?: IChatMessage[];
    title: string;
    lastSeen: Date;
    unseenCount: number;
    picture: string;
}

export interface IChatMessage {
    roomId: number;
    sender: string;
    senderProfilePicture: string;
    sentAt: Date;
    messageType: string;
    text?: string;
    image?: ArrayBuffer;
}

export interface IChatUpdate {
    update: Update;
    roomId: number;
    user?: IUser;
    title?: string;
    picture?: string;
}

export enum Update {
    AddUser,
    RemoveUser,
    Title,
    Picture
}

export interface IChatHash {
    [key: string]: IChatMessage[];
}

