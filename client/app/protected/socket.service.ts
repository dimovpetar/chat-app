import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';
import { IChatMessage, IChatRoom, IChatUpdate } from '../../../shared/interfaces/chatroom';


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

  leaveRoom(roomId: number) {
    this.socket.emit('unsubscribe', roomId);
  }

  disconnect() {
    this.socket.disconnect();
  }

  messages(): Subject<IChatMessage> {
    const observable = new Observable(obs => {
      this.socket.on('message', (message: IChatMessage) => {
        obs.next(message);
      });
    });
    const observer = {
      next: (message: IChatMessage) => {
        console.log('sending');
        this.socket.emit('message', message);
      }
    };
    return Subject.create(observer, observable);
  }

  newChatRoom(): Observable<IChatRoom> {
    return new Observable<IChatRoom>(obs => {
      this.socket.on('newRoom', (chat) => {
        console.log('add chat', chat);
        obs.next(chat);
      });
    });
  }

  updateChatRoom(): Observable<IChatUpdate> {
    return new Observable<IChatUpdate>(obs => {
      this.socket.on('updateChatRoom', (update: any) => {
        console.log('update chat room', update);
        obs.next(update);
      });
    });
  }

}
