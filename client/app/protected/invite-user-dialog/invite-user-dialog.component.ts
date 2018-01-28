import { Component, OnInit, EventEmitter } from '@angular/core';
import { Update } from '../../../../shared/interfaces/chatroom';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-invite-user-dialog',
  templateUrl: './invite-user-dialog.component.html',
  styleUrls: ['./invite-user-dialog.component.css']
})
export class InviteUserDialogComponent implements OnInit {
  public username = '';
  public invite = new EventEmitter();
  constructor(private dialog: MatDialogRef<InviteUserDialogComponent>) {  }

  ngOnInit() {
  }

  inviteUser() {
    this.invite.emit(this.username);
    this.username = '';
  }

  cancel() {
    this.dialog.close();
  }

}
