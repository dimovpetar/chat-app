import { Component, OnInit, Input, OnDestroy, OnChanges, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { IChatRoom, IChatMessage, Update } from '../../../../shared/interfaces/chatroom';
import { ChatService } from '../chat.service';
import { Subscription } from 'rxjs/Subscription';
import { MatDialogRef, MatDialog } from '@angular/material';
import { InviteUserDialogComponent } from '../invite-user-dialog/invite-user-dialog.component';
import { ChangeTitleDialogComponent } from '../change-title-dialog/change-title-dialog.component';
import { SocketService } from '../socket.service';
import { ChangeChatPictureDialogComponent } from '../change-chat-picture-dialog/change-chat-picture-dialog.component';
import { ImageUploadService } from '../image-upload.service';


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

  sendMessage() {
    const chatMessage: IChatMessage = {
      roomId: this.room.id,
      sender: localStorage.getItem('username'),
      senderProfilePicture: localStorage.getItem('profilePicture'),
      text: this.message,
      sentAt: new Date(),
      messageType: 'text'
    };

    this.socketService.messages().next(chatMessage);
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

  isNewer(time1: string, time2: string) {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    const minute = 60;
    return ((date1.getTime() - date2.getTime()) / 1000) > minute;
  }

  sendFileMessage(files: FileList) {
    const fileReader = new FileReader();
    const room = this.room;
    const socketService = this.socketService;

    fileReader.readAsArrayBuffer(files[0]);
    fileReader.onload = function () {

      const chatMessage = {
        roomId: room.id,
        sender: localStorage.getItem('username'),
        senderProfilePicture: localStorage.getItem('profilePicture'),
        sentAt: new Date(),
        text: '',
        messageType: 'image',
        image: fileReader.result
      };
      socketService.messages().next(chatMessage);
    };
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
