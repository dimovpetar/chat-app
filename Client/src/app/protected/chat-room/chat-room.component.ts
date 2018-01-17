import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { Chat, ChatMessage } from '../../interfaces/chat';
import { ChatService } from '../chat.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnDestroy, OnChanges {
  @Input() chat: Chat;
  private message = '';
  public messages: ChatMessage[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.messages$.subscribe(msg => {
      this.messages.push(msg);
      const el = document.getElementById('messages');
      el.scrollTop = el.scrollHeight;
    });
  }

  sendMessage() {
    const chatMessage: ChatMessage = {
      chatId: this.chat._id,
      sender: localStorage.getItem('username'),
      message: this.message
    };

    this.chatService.sendMsg(chatMessage);
    this.message = '';

   this.chatService.addChats([{
      _id: 12,
      title: 'asd'
    }]);

  }

  ngOnChanges() {
    console.log('room changed');
    if (this.chat) {
      this.messages = this.chatService.getLastMessages(this.chat._id, 10);
    }
  }

  ngOnDestroy() {
    console.log('Destroyed chat room');
  }

}
