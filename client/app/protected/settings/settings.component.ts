import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.socketService.disconnect();
    window.location.reload();
  }

}
