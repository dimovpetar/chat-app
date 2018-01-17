import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router/';
import { AuthService } from '../../core/auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() viewFriendRequests: EventEmitter<string> = new EventEmitter<string>();
  private friend = '';
  private sendStatus = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  listRequests() {
    this.viewFriendRequests.emit('friendRequests');
  }

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
