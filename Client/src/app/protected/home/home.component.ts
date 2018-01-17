import { Component, OnInit } from '@angular/core';
import { NgSwitch } from '@angular/common';
import { Chat } from '../../interfaces/chat';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private selected;
  private chat: Chat;

  constructor() {
    this.selected = 'chatRoom';
  }

  ngOnInit() {
  }

  changeView(view: string) {
    this.selected = view;
  }

  changeChatRoom(chat) {
    this.selected = 'chatRoom';
    this.chat = chat;
  }

}
