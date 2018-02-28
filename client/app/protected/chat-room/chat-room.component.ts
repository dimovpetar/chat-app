import { Component, OnInit, Input, OnDestroy, OnChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { IChatRoom, IChatMessage, Update } from '../../../../shared/interfaces/chatroom';
import { Subscription } from 'rxjs/Subscription';
import { MatDialogRef, MatDialog } from '@angular/material';
import {
  InviteUserDialogComponent,
  ChangeTitleDialogComponent,
  ChangeChatPictureDialogComponent,
  LeaveRoomDialogComponent } from '../dialogs';
import { SocketService, ImageUploadService, ChatService } from '../services';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})

export class ChatRoomComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {
  @Input() room: IChatRoom;
  @ViewChild('scrollMe') scrollContainer: ElementRef;
  public message = '';
  public username = localStorage.getItem('username');
  private disableScroll = false;
  private inviteUserDialogRef: MatDialogRef<InviteUserDialogComponent>;
  private changeTitleDialogRef: MatDialogRef<ChangeTitleDialogComponent>;
  private changePictureDialogRef: MatDialogRef<ChangeChatPictureDialogComponent>;
  private leaveRoomDialogRef: MatDialogRef<LeaveRoomDialogComponent>;

  public image: HTMLImageElement;

  constructor(
    private chatService: ChatService,
    private socketService: SocketService,
    private imageService: ImageUploadService,
    private dialog: MatDialog
  ) {  }

  ngOnInit() {  }

  ngOnChanges() {
  }

  ngAfterViewChecked() {
      this.scrollToBottom();
  }

  ngOnDestroy() {
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

  sendMessage(message: IChatMessage) {
    message.roomId = this.room.id;
    this.socketService.messages().next(message);
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
          username: localStorage.getItem('username'),
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
      height: '50%',
      width: '50%'
    });

    const sub = this.changeTitleDialogRef.componentInstance.changeTitle
    .subscribe( (title: string) => {
      this.chatService.updateChatRoom({
        update: Update.Title,
        roomId: this.room.id,
        title: title
      });
    });

    this.changeTitleDialogRef.afterClosed()
    .subscribe( () => {
      sub.unsubscribe();
    });
  }

  openPictureDialog() {
    this.changePictureDialogRef = this.dialog.open(ChangeChatPictureDialogComponent, {
      height: '50%',
      width: '50%'
    });

    const sub = this.changePictureDialogRef.componentInstance.changePicture
    .subscribe( (files: FileList) => {
      console.log(files);
      this.imageService.postChatImage(files.item(0), this.room.id)
      .subscribe( (data: any) => {
        console.log(data);
        }, error => {
          console.log(error);
      });
    });

    this.changePictureDialogRef.afterClosed()
    .subscribe( () => {
      sub.unsubscribe();
    });
  }

  openLeaveRoomDialog() {
    this.leaveRoomDialogRef = this.dialog.open(LeaveRoomDialogComponent, {
      height: '50%',
      width: '50%'
    });

    const sub = this.leaveRoomDialogRef.componentInstance.leave
    .subscribe( (leave: boolean) => {
      this.leaveRoom();
    });

    this.leaveRoomDialogRef.afterClosed()
    .subscribe( () => {
      sub.unsubscribe();
    });
  }

  isNewer(time1: string, time2: string) {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    const minute = 60;
    return ((date1.getTime() - date2.getTime()) / 1000) > minute;
  }

  transform(date: Date) {
    const hm = new Date(date);
    let hh = '';
    let mm = '';

    if (hm.getMinutes() < 10) {
      mm = '0' + hm.getMinutes();
    } else {
      mm = hm.getMinutes().toString();
    }

    if (hm.getHours() < 10) {
      hh = '0' + hm.getHours();
    } else {
      hh = hm.getHours().toString();
    }

    return hh + ':' + mm;
  }
}
