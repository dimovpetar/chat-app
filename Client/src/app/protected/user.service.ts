import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FriendRequest } from '../interfaces/friend-request';
import { SocketService } from './socket.service';

@Injectable()
export class UserService {
 
  constructor(private http: HttpClient) {  }

  listFriendRequests() {
    return this.http.get<FriendRequest[]>('http://localhost:3000/user');
  }

  sendFriendRequest(username: string) {
    return this.http.post(`http://localhost:3000/user/${username}`, {});
  }

  acceptFriendRequest(senderId: number, username: string) {
    const reqToHandle = {
      senderId: senderId,
      senderUsername: username,
      decision: 'accept'
    };
    return this.http.post('http://localhost:3000/user', reqToHandle);
  }

  declineFriendRequest(senderId: number) {
    const reqToHandle = {
      senderId: senderId,
      decision: 'decline'
    };
    return this.http.post('http://localhost:3000/user', reqToHandle);
  }
}
