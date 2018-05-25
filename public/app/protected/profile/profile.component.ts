import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IUser } from '../../../../shared/interfaces/user';
import { SocketService } from '../services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Output() settings: EventEmitter<Boolean> = new EventEmitter<Boolean> ();
  private subscription: any;
  public user: IUser;

  constructor( private socketService: SocketService ) {
    this.user = {
      username: localStorage.getItem('username'),
      profilePicture: localStorage.getItem('profilePicture')
    };

    this.subscription = this.socketService.newProfilePicture()
    .subscribe( (picturePath: string) => {
      this.user.profilePicture = picturePath;
      localStorage.setItem('profilePicture', picturePath);
    });
  }

  ngOnInit() {
  }

  showSettings() {
    this.settings.emit(true);
  }

}
