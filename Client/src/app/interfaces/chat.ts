/*export interface Chat {
    title: string;
    _id: number;
}*/

import { User } from './user';

export interface ChatRoom {
    id: number;
    admins: User[];
    participants: User[];
    title: string;
    messages?: string[];
}

export interface ChatMessage {
    roomId: number;
    message: string;
    sender: string;
}

export interface ChatHash {
    [key: string]: ChatMessage[];
}
