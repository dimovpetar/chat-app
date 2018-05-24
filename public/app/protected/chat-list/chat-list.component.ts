import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IChatRoom, IChatUpdate, Update, IChatMessage } from '../../../../shared/interfaces/chatroom';
import { Subscription } from 'rxjs/Subscription';
import { SocketService, ChatService } from '../services';
import { IUser } from '../../../../shared/interfaces/user';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {
  @Output() selectedChat: EventEmitter<IChatRoom> = new EventEmitter<IChatRoom> ();
  public chatList: IChatRoom[] = [];
  public selected: IChatRoom;
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private socketService: SocketService
  ) {

    this.chatService.loadAll();

    const s1 = socketService.messages()
    .subscribe( (message: IChatMessage) => {
      this.appendMessage(message);
    });

    const s2 = this.chatService.chatList$
    .subscribe((chatRooms: IChatRoom[]) => {
      chatRooms.forEach( el => this.chatList.push(el));
    });

    const s3 = this.socketService.update()
    .subscribe( (update: IChatUpdate) => {
      this.handleUpdate(update);
    });

    this.subscriptions.push(s1, s2, s3);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach( s => s.unsubscribe());
  }

  handleUpdate(update: IChatUpdate) {
    const index = this.findIndex(update.roomId);

    switch (update.update) {
      case Update.Title:
        this.chatList[index].title = update.title;
        break;
      case Update.Picture:
        this.chatList[index].picture = update.picture;
        break;
      case Update.AddUser:
        this.chatList[index].members ?
            this.chatList[index].members.push(update.user) : this.chatList[index].members = [update.user];
        break;
      case Update.RemoveUser:
        if (update.user.username === localStorage.getItem('username')) {
          this.chatList.splice(index, 1);
          this.changeChatRoom(this.chatList[index - 1]);
          this.socketService.leaveRoom(update.roomId);
        } else {
        const remove = this.chatList[index].members.indexOf(update.user);
        this.chatList[index].members.splice(remove, 1);
        }
        break;
    }
  }

  changeChatRoom(chatRoom: IChatRoom) {

    this.selectedChat.emit(chatRoom);
    if (chatRoom) {
      this.selected = chatRoom;
      this.selected.unseenCount = 0;
      this.socketService.setLastSeen(localStorage.getItem('username'), this.selected.id, new Date());
      if (this.firstClick(chatRoom)) {
        this.chatRoomInit(chatRoom);
      }
    }
  }

  appendMessage(message: IChatMessage) {
    const index = this.findIndex(message.roomId);

    if (this.chatList[index].messages) {
        this.chatList[index].messages.push(message);
    }

    if (message.roomId === this.selected.id) {
      this.socketService.setLastSeen(localStorage.getItem('username'), this.selected.id, new Date());
    } else {
      this.chatList[index].unseenCount += 1;
    }
  }

  createChatRoom() {
    this.chatService.createChatRoom();
  }

  findIndex(roomId: number) {
    return this.chatList.findIndex( room => room.id === roomId);
  }

  firstClick(chatRoom: IChatRoom) {
    return chatRoom.messages ? false : true;
  }

  chatRoomInit(chatRoom: IChatRoom) {
    this.chatService.loadMembers(chatRoom.id)
    .subscribe( (members: IUser[]) => {
      chatRoom.members = members;
    });

    this.messagesInit(chatRoom);
  }

  messagesInit(chatRoom: IChatRoom) {
    this.chatService.getMessagesBefore(new Date(), chatRoom.id)
    .subscribe((messages: IChatMessage[]) => {
      chatRoom.messages = messages;
    });
  }

}
