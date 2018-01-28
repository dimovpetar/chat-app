import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { IChatRoom, IChatMessage, Update } from '../../../../shared/interfaces/chatroom';
import { ChatService } from '../chat.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})

export class ChatRoomComponent implements OnInit, OnDestroy, OnChanges {
  @Input() room: IChatRoom;
  public message = '';
  public messages: IChatMessage[] = [];
  public username = localStorage.getItem('username');
  private subscription: Subscription;
  public inviteUser = '';

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
    const chatMessage: IChatMessage = {
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

  leaveRoom() {
    this.chatService.updateChatRoom({
        update: Update.RemoveUser,
        roomId: this.room.id,
        user: {
          username: this.username
        }
    });
  }

  addUser() {
    this.chatService.updateChatRoom({
      update: Update.AddUser,
      roomId: this.room.id,
      user: {
        username: this.inviteUser
      }
    });
    this.inviteUser = '';
  }

}
