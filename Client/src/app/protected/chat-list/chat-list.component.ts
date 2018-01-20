import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../chat.service';
import { Chat } from '../../interfaces/chat';
import { SocketService } from '../socket.service';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {
  @Output() selectedChat: EventEmitter<Chat> = new EventEmitter<Chat> ();
  public chatList: Chat[] = [];
  private subscribtion;

  constructor(
    private chatService: ChatService,
    private socketService: SocketService) { }

  ngOnInit() {
    this.chatService.loadAll();
    this.subscribtion = this.chatService.chatList$
    .subscribe((chat: Chat[]) => {
      chat.forEach( el => this.chatList.push(el));
    });
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

  changeChatRoom(id: number, title: string) {
    this.selectedChat.emit({_id: id, title: title});
  }

}
