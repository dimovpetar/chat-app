import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { IChatRoom, IChatMessage, Update } from '../../../../shared/interfaces/chatroom';
import { ChatService } from '../chat.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Subscription } from 'rxjs/Subscription';
import { MatDialogRef, MatDialog } from '@angular/material';

import { InviteUserDialogComponent } from '../invite-user-dialog/invite-user-dialog.component';
import { ChangeTitleDialogComponent } from '../change-title-dialog/change-title-dialog.component';


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
  private inviteUserDialogRef: MatDialogRef<InviteUserDialogComponent>;
  private changeTitleDialogRef: MatDialogRef<ChangeTitleDialogComponent>;

  constructor(private chatService: ChatService, private dialog: MatDialog) {  }

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


  openInviteUserDialog() {
    this.inviteUserDialogRef = this.dialog.open(InviteUserDialogComponent, {
      height: '40%',
      width: '40%'
    });

    const sub = this.inviteUserDialogRef.componentInstance.invite
    .subscribe( (username: string) => {
      this.chatService.updateChatRoom({
        update: Update.AddUser,
        user: {
          username: username
        },
        roomId: this.room.id
      });
    });

    this.inviteUserDialogRef.afterClosed()
    .subscribe( () => {
      sub.unsubscribe();
    });
  }

  openTitleDialog() {
    this.changeTitleDialogRef = this.dialog.open(ChangeTitleDialogComponent, {
      height: '40%',
      width: '40%'
    });

    const sub = this.changeTitleDialogRef.componentInstance.changeTitle
    .subscribe( (title: string) => {
      this.chatService.updateChatRoom({
        update: Update.Title,
        roomId: this.room.id,
        title: title
      });
    });

    this.inviteUserDialogRef.afterClosed()
    .subscribe( () => {
      sub.unsubscribe();
    });
  }

}
