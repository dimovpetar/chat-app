import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { ChatRoom, ChatMessage } from '../../interfaces/chat';
import { ChatService } from '../chat.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnDestroy, OnChanges {
  @Input() room: ChatRoom;
  public message = '';
  public messages: ChatMessage[] = [];
  public user = localStorage.getItem('username');
  private subscription: Subscription;

  constructor(private chatService: ChatService) {  }

  ngOnInit() {
    this.subscription = this.chatService.messages$
    .subscribe(msg => {
      this.messages.push(msg);
      const el = document.getElementById('messages');
      if (el) {
      el.scrollTop = el.scrollHeight;
      }
    });
  }

  sendMessage() {
    const chatMessage: ChatMessage = {
      roomId: this.room.id,
      sender: localStorage.getItem('username'),
      message: this.message
    };
    this.chatService.sendMsg(chatMessage);
    this.message = '';
  }

  ngOnChanges() {
    if (this.room) {
      this.messages = this.chatService.getLastMessages(this.room.id, 10);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
