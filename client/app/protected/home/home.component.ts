import { Component, OnInit } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { IChatRoom } from '../../../../shared/interfaces/chatroom';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public selected;
  public room: IChatRoom;

  constructor() {
    this.selected = 'settings';
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

  createNewChatRoom() {
    this.selected = 'createChat';
  }

  showSettings() {
    this.selected = 'settings';
  }

}
