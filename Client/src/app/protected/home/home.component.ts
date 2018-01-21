import { Component, OnInit } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { ChatRoom } from '../../interfaces/chat';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public selected;
  public room: ChatRoom;

  constructor() {
    this.selected = 'chatRoom';
  }

  ngOnInit() {
  }

  changeView(view: string) {
    this.selected = view;
  }

  changeChatRoom(room) {
    this.selected = 'chatRoom';
    this.room = room;
  }

}
