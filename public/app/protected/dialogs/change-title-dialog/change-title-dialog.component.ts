import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-change-title-dialog',
  templateUrl: './change-title-dialog.component.html',
  styleUrls: ['./change-title-dialog.component.css']
})
export class ChangeTitleDialogComponent implements OnInit {
  public title = '';
  public changeTitle = new EventEmitter();

  constructor(private dialog: MatDialogRef<ChangeTitleDialogComponent>) {  }

  ngOnInit() {

  }

  change() {
    this.changeTitle.emit(this.title);
    this.dialog.close();
    this.title = '';
  }

  cancel() {
    this.dialog.close();
  }

}
