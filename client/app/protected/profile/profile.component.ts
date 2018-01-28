import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../../shared/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: IUser;
  constructor() {
    this.user = { username: localStorage.getItem('username')};
  }

  ngOnInit() {
  }

}
