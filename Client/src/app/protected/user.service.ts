import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FriendRequest } from '../interfaces/friend-request';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  listFriendRequests() {
    return this.http.get<FriendRequest[]>('http://localhost:3000/user');
  }

  sendFriendRequest(username: string) {
    return this.http.post(`http://localhost:3000/user/${username}`, {});
  }

  acceptFriendRequest(id: number, username: string) {
    const reqToHandle = {
      senderId: id,
      senderUsername: username,
      decision: 'accept'
    };

    return this.http.post('http://localhost:3000/user', reqToHandle);
  }

  declineFriendRequest(id: number) {
    const reqToHandle = {
      senderId: id,
      decision: 'decline'
    };

    return this.http.post('http://localhost:3000/user', reqToHandle);
  }
}
