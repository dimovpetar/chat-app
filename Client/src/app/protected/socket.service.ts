import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ChatMessage, Chat } from '../interfaces/chat';


@Injectable()
export class SocketService {
  private socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  messages(): Subject<ChatMessage> {
    const observable = new Observable(obs => {
      this.socket.on('message', (data) => {
        console.log('Received message from Websocket Server');
        obs.next(data);
      });
      return () => this.socket.disconnect();
    });
    const observer = {
      next: (data: ChatMessage) => {
        this.socket.emit('message', data);
      }
    };
    return Subject.create(observer, observable);
  }

  chats(): Observable<Chat> {
    return new Observable<Chat>(obs => {
      this.socket.on('chat', (chat) => {
         console.log('add chat');
        obs.next(chat);
      });
      return () => this.socket.disconnect();
    });
  }
}
