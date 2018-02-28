import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ChangeTitleDialogComponent } from '../change-title-dialog/change-title-dialog.component';

@Component({
  selector: 'app-change-chat-picture-dialog',
  templateUrl: './change-chat-picture-dialog.component.html',
  styleUrls: ['./change-chat-picture-dialog.component.css']
})
export class ChangeChatPictureDialogComponent implements OnInit {
  public changePicture = new EventEmitter();

  constructor(private dialog: MatDialogRef<ChangeTitleDialogComponent>) {  }

  ngOnInit() {
  }

  change(picture: File) {
    this.changePicture.emit(picture);
    this.dialog.close();
  }

  cancel() {
    this.dialog.close();
  }

}
