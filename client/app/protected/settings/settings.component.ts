import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { SocketService } from '../socket.service';
import { ImageUploadService } from '../image-upload.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  imageToUpload: File = null;

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
    console.log(this.imageToUpload);
    this.uploadImage();
  }

  uploadImage() {
    this.uploadService.postImage(this.imageToUpload)
    .subscribe( (data: any) => {
      console.log(data);
      localStorage.setItem('profilePicture', data.filename);
      }, error => {
        console.log(error);
    });
  }

}
