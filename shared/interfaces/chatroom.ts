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
    text: string;
    sender: string;
    senderProfilePicture: string;
    sentAt: Date;
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

