import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ChatMessage, Chat } from '../interfaces/chat';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { FriendRequest } from '../interfaces/friend-request';


@Injectable()
export class SocketService {
  private socket;

  constructor() {
    this.socket = io('http://localhost:3000');
    this.socket.emit('init', localStorage.getItem('username'));
  }

  joinRoom(roomId: number) {
    this.socket.emit('subscribe', roomId);
  }

  disconnect() {
    this.socket.disconnect();
  }

  messages(): Subject<ChatMessage> {
    const observable = new Observable(obs => {
      this.socket.on('message', (message: ChatMessage) => {
        obs.next(message);
      });
    });
    const observer = {
      next: (message: ChatMessage) => {
        this.socket.emit('message', message);
      }
    };
    return Subject.create(observer, observable);
  }

  chats(): Observable<Chat> {
    return new Observable<Chat>(obs => {
      this.socket.on('newRoom', (chat) => {
        console.log('add chat', chat);
        obs.next(chat);
      });
      return () => this.socket.disconnect();
    });
  }

  friendRequest(): Observable<FriendRequest> {
    return new Observable<FriendRequest> (obs => {
      this.socket.on('newFriendRequest', data => {
        obs.next(data);
      });
      return () => this.socket.disconnect();
    });
  }

}
