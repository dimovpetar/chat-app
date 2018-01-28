import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../chat.service';
import { IChatRoom, IChatUpdate, Update } from '../../../../shared/interfaces/chatroom';
import { SocketService } from '../socket.service';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {
  @Output() selectedChat: EventEmitter<IChatRoom> = new EventEmitter<IChatRoom> ();
  public chatList: IChatRoom[] = [];
  private subscribtion;

  constructor(
    private chatService: ChatService,
    private socketService: SocketService) { }

  ngOnInit() {
    this.chatService.loadAll();
    this.subscribtion = this.chatService.chatList$
    .subscribe((chat: IChatRoom[]) => {
      chat.forEach( el => this.chatList.push(el));
    });

    this.chatService.update$
    .subscribe( (update: IChatUpdate) => {
      let index: number;
      for (let i = 0; i < this.chatList.length; i++) {
        if (this.chatList[i].id === update.roomId) {
          index = i;
        }
      }

      if (update.user.username === localStorage.getItem('username')) {
        this.chatList.splice(index, 1);
        this.chatService.leaveRoom(update.roomId);
      } else if (update.update === Update.AddUser ) {
        this.chatList[index].members ?
          this.chatList[index].members.push(update.user) : this.chatList[index].members = [update.user];
      } else if (update.update === Update.RemoveUser ) {
        const a = this.chatList[index].members.indexOf(update.user);
        this.chatList[index].members.splice(a, 1);
      }
    });
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

  changeChatRoom(chatRoom: IChatRoom) {
    this.selectedChat.emit(chatRoom);
  }

  createChatRoom() {
    this.chatService.createChatRoom();
  }

}
