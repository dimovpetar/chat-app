import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IUser } from '../../../../shared/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Output() settings: EventEmitter<Boolean> = new EventEmitter<Boolean> ();
  public user: IUser;
  constructor() {
    this.user = {
      username: localStorage.getItem('username'),
      profilePicture: localStorage.getItem('profilePicture')
    };
    console.log(this.user);
  }

  ngOnInit() {
  }

  showSettings() {
    this.settings.emit(true);
  }

}
