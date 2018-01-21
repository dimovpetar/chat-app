import { IUser} from './user';

export interface IChatRoom {
    admins: IUser[];
    participants: IUser[];
    title: string;
    messages?: string[];
}

export interface ChatMessage {
    roomId: string;
    message: string;
    sender: string;
}
