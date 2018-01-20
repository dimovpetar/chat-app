import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { Chat, ChatMessage, ChatHash } from '../interfaces/chat';
import { SocketService } from './socket.service';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class ChatService {
  public messages$: Subject<ChatMessage>;
  public chat: ChatHash = {};
  public chatList$: Subject<Chat[]> = new Subject<Chat[]>();
  public newChat$: Subscription;

  constructor(private http: HttpClient, private socketService: SocketService) {
    this.messages$ = <Subject<ChatMessage>>socketService.messages()
    .map((message: ChatMessage) => {
      this.chat[message.roomId] ?
          this.chat[message.roomId].push(message) : this.chat[message.roomId] = [message];
      return message;
    });

    this.newChat$ = socketService.chats()
    .subscribe((chat: Chat) => {
        this.joinRooms([chat]);
        return chat;
    });
  }

  sendMsg(message: ChatMessage) {
    this.messages$.next(message);
  }

  loadAll() {
    this.http.get<Chat[]>('http://localhost:3000/chatroom')
    .subscribe(chats => {
      this.joinRooms(chats);
    });
  }

  joinRooms(chats: Chat[]) {
    this.chatList$.next(chats);
    chats.forEach( el => this.socketService.joinRoom(el._id));
  }

  getLastMessages(chatId: number, count: number) {
    if (this.chat[chatId]) {
      return this.chat[chatId];
    }
    return [];
  }

}