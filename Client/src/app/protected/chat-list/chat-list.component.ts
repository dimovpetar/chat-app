import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../chat.service';
import { ChatRoom } from '../../interfaces/chat';
import { SocketService } from '../socket.service';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {
  @Output() selectedChat: EventEmitter<ChatRoom> = new EventEmitter<ChatRoom> ();
  public chatList: ChatRoom[] = [];
  private subscribtion;

  constructor(
    private chatService: ChatService,
    private socketService: SocketService) { }

  ngOnInit() {
    this.chatService.loadAll();
    this.subscribtion = this.chatService.chatList$
    .subscribe((chat: ChatRoom[]) => {
      chat.forEach( el => this.chatList.push(el));
    });
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

  changeChatRoom(chatRoom: ChatRoom) {
    this.selectedChat.emit(chatRoom);
  }

}
