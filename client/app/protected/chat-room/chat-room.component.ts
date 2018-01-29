import { Component, OnInit, Input, OnDestroy, OnChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { IChatRoom, IChatMessage, Update } from '../../../../shared/interfaces/chatroom';
import { ChatService } from '../chat.service';
import { Subscription } from 'rxjs/Subscription';
import { MatDialogRef, MatDialog } from '@angular/material';
import { InviteUserDialogComponent } from '../invite-user-dialog/invite-user-dialog.component';
import { ChangeTitleDialogComponent } from '../change-title-dialog/change-title-dialog.component';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})

export class ChatRoomComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {
  @Input() room: IChatRoom;
  @ViewChild('scrollMe') scrollContainer: ElementRef;
  private disableScroll = false;
  public username = localStorage.getItem('username');
  public message = '';
  public messages: IChatMessage[] = [];
  private subscription: Subscription;
  private inviteUserDialogRef: MatDialogRef<InviteUserDialogComponent>;
  private changeTitleDialogRef: MatDialogRef<ChangeTitleDialogComponent>;
  constructor(
    private chatService: ChatService,
    private dialog: MatDialog
  ) {  }

  ngOnInit() {
    this.subscription = this.chatService.messages$
    .subscribe(msg => {
      this.messages.push(msg);
    });
  }

  ngOnChanges() {
    if (this.room) {
      this.messages = this.chatService.getLastMessages(this.room.id, 10);
    }
  }

  ngAfterViewChecked() {
      this.scrollToBottom();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  onScroll() {
    const element = this.scrollContainer.nativeElement;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atBottom) {
      this.disableScroll = false;
    } else {
      this.disableScroll = true;
    }
  }

  scrollToBottom() {
    if (this.disableScroll) {
      return;
    }
    try  {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  leaveRoom() {
    this.chatService.updateChatRoom({
        update: Update.RemoveUser,
        roomId: this.room.id,
        user: {
          username: localStorage.getItem('username')
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
