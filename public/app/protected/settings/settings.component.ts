import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { SocketService, ImageUploadService } from '../services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  imageToUpload: File = null;
  profilePicture = localStorage.getItem('profilePicture');

  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private uploadService: ImageUploadService
  ) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.socketService.disconnect();
    window.location.reload();
  }

  handleFileInput(files: FileList) {
    this.imageToUpload = files.item(0);
    this.uploadImage();
  }

  uploadImage() {
    this.uploadService.postUserImage(this.imageToUpload)
    .subscribe( (data: any) => {
      localStorage.setItem('profilePicture', data.filename);
      }, error => {
        console.log(error);
    });
  }

}
