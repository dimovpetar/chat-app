import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from '../user.service';
import { FriendRequest } from '../../interfaces/friend-request';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit {

  @Output() newChat: EventEmitter<boolean> = new EventEmitter<boolean>();
  private friendRequests: FriendRequest[] = [];
  private friendshipMessage = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.listFriendRequests();
  }

  listFriendRequests() {
    this.userService.listFriendRequests()
    .subscribe( data => {
      this.friendRequests = data;
    }, e => {
      console.log(e);
    });
  }

  acceptFriendRequest(id, username) {
    this.userService.acceptFriendRequest(id, username)
    .subscribe( data => {
      this.friendshipMessage = 'Accepted';
      this.newChat.emit(true);
    }, e => {
      console.log(e);
    });
  }

  declineFriendRequest(id) {
    this.userService.declineFriendRequest(id)
    .subscribe( data => {
      this.friendshipMessage = 'Declined';
    }, e => {
      console.log(e);
    });
  }

}
