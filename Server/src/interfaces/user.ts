export interface IUser {
    username: string
    password: string;
    email: string;
    friendList?: any[];
    friendRequests?: any[];
    chatRooms?: any[];
}
