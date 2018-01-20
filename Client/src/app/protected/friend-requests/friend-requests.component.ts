import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { UserService } from '../user.service';
import { FriendRequest } from '../../interfaces/friend-request';
import { SocketService } from '../socket.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit, OnDestroy {

  @Output() newChat: EventEmitter<boolean> = new EventEmitter<boolean>();
  public friendRequests: FriendRequest[] = [];
  private friendshipMessage = '';
  private subscription: Subscription;

  constructor(private userService: UserService,  private socketService: SocketService) {
   /* this.subscription = socketService.friendRequest()
    .subscribe(data => {
      console.log('new friend request');
    });*/
  }

  ngOnInit() {
    this.listFriendRequests();
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  listFriendRequests() {
    this.userService.listFriendRequests()
    .subscribe( data => {
      this.friendRequests = data;
    }, e => {
      console.log(e);
    });
  }

  acceptFriendRequest(senderId, username) {
    this.userService.acceptFriendRequest(senderId, username)
    .subscribe( data => {
      this.friendshipMessage = 'Accepted';
    }, e => {
      console.log(e);
    });
  }

  declineFriendRequest(senderId) {
    this.userService.declineFriendRequest(senderId)
    .subscribe( data => {
      this.friendshipMessage = 'Declined';
    }, e => {
      console.log(e);
    });
  }

}
