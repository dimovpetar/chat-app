import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-leave-room-dialog',
  templateUrl: './leave-room-dialog.component.html',
  styleUrls: ['./leave-room-dialog.component.css']
})
export class LeaveRoomDialogComponent implements OnInit {
  public leave = new EventEmitter();

  constructor(private dialog: MatDialogRef<LeaveRoomDialogComponent>) { }

  ngOnInit() {
  }

  leaveRoom() {
    this.leave.emit(true);
    this.dialog.close();
  }

  cancel() {
    this.dialog.close();
  }

}
