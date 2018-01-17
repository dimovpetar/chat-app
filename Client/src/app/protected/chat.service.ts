import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { Chat, ChatMessage, ChatHash } from '../interfaces/chat';
import { SocketService } from './socket.service';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {
  public messages$: Subject<ChatMessage>;
  public chat: ChatHash = {};
  public chatList$: Subject<Chat[]> = new Subject<Chat[]>();
  public newChat$: any;

  constructor(private http: HttpClient, private socketService: SocketService) {
    this.messages$ = <Subject<ChatMessage>>socketService.messages()
    .map((message: ChatMessage) => {
      this.chat[message.chatId] ?
          this.chat[message.chatId].push(message) : this.chat[message.chatId] = [message];
      return message;
    });

    this.newChat$ = socketService.chats()
    .subscribe((chat: Chat) => {
        this.addChats([chat]);
        return chat;
    });

    this.loadAll();
  }

  sendMsg(message: ChatMessage) {
    this.messages$.next(message);
  }

  loadAll() {
    this.http.get<Chat[]>('http://localhost:3000/chatroom')
    .subscribe(chats => {
      this.addChats(chats);
    });
  }

  addChats(chats: Chat[]) {
    this.chatList$.next(chats);
  }

  getLastMessages(chatId: number, count: number) {
    if (this.chat[chatId]) {
      return this.chat[chatId];
    }
    return [];
  }

}
