import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router/';
import { AuthService } from '../../core/auth.service';
import { UserService } from '../user.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
 // @Output() viewFriendRequests: EventEmitter<string> = new EventEmitter<string>();
  public friend = '';
  private sendStatus = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private socketService: SocketService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.socketService.disconnect();
    window.location.reload();
  }

  /*listRequests() {
    this.viewFriendRequests.emit('friendRequests');
  }*/

  addFriend() {
    this.userService.sendFriendRequest(this.friend)
    .subscribe( data => {
      this.sendStatus = 'Friend request sent';
    }, e => {
      this.sendStatus = 'Problem sending request.';
      console.log(e);
    });
    this.friend = '';
  }
}
