import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../chat.service';
import { IChatRoom, IChatUpdate, Update, IChatMessage } from '../../../../shared/interfaces/chatroom';
import { SocketService } from '../socket.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import chatroom from '../../../../server/routes/chatroom';


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
    .subscribe((chat: IChatRoom[]) => {
      chat.forEach( el => this.chatList.push(el));
    });

    const s3 = this.socketService.update()
    .subscribe( (update: IChatUpdate) => {
      this.handleUpdate(update);
    });

    this.subscriptions.push(s1, s2, s3);
    console.log('chat list ctr');
  }

  ngOnInit() {
    console.log('chat list init');
  }

  ngOnDestroy() {
    this.subscriptions.forEach( s => s.unsubscribe());
    console.log('chat list destroyted');
  }

  handleUpdate(update: IChatUpdate) {
    const index = this.findIndex(update.roomId);

    if (update.update === Update.Title) {
      this.chatList[index].title = update.title;
    } else if (update.user.username === localStorage.getItem('username')) {
      this.chatList.splice(index, 1);
      this.changeChatRoom(this.chatList[index - 1]);
      this.socketService.leaveRoom(update.roomId);
    } else if (update.update === Update.AddUser ) {
      this.chatList[index].members ?
        this.chatList[index].members.push(update.user) : this.chatList[index].members = [update.user];
    } else if (update.update === Update.RemoveUser ) {
      const remove = this.chatList[index].members.indexOf(update.user);
      this.chatList[index].members.splice(remove, 1);
    }
  }

  changeChatRoom(chatRoom: IChatRoom) {
    this.selectedChat.emit(chatRoom);
    if (chatRoom) {
      this.selected = chatRoom;
      this.selected.unseenCount = 5;
      this.socketService.setLastSeen(localStorage.getItem('username'), this.selected.id, new Date());
      this.messagesInit(chatRoom);
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

  messagesInit(chatRoom: IChatRoom) {
    if (this.firstClick(chatRoom)) {
      this.chatService.getMessagesBefore(new Date(), chatRoom.id)
      .subscribe( (messages: IChatMessage[]) => {
        chatRoom.messages = messages;
      });
    }
  }

}
