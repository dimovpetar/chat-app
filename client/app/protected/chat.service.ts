import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IChatRoom, IChatMessage, IChatHash, IChatUpdate } from '../../../shared/interfaces/chatroom';
import { SocketService } from './socket.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class ChatService {
  public chat: IChatHash = {};
  public messages$: Subject<IChatMessage>;
  public chatList$:  Subject<IChatRoom[]> = new Subject<IChatRoom[]>();
  public update$:   Subject<IChatUpdate> = new Subject<IChatUpdate>();
  public updateSubscr:  Subscription;
  public newRoomSubscr: Subscription;

  constructor(private http: HttpClient, private socketService: SocketService) {

    this.messages$ = <Subject<IChatMessage>>socketService.messages()
    .map((message: IChatMessage) => {
      this.chat[message.roomId] ?
          this.chat[message.roomId].push(message) : this.chat[message.roomId] = [message];
      return message;
    });

    this.newRoomSubscr = socketService.newChatRoom()
    .subscribe((chat: IChatRoom) => {
        this.joinChatRooms([chat]);
        return chat;
    });

    this.updateSubscr = socketService.updateChatRoom()
    .subscribe( (update: IChatUpdate) => {
      this.chatRoomUpdate(update);
    });
  }

  createChatRoom() {
    this.http.post('/api/chatroom', {})
    .subscribe( data => {
     // console.log(data);
    });
  }

  sendMsg(message: IChatMessage) {
    this.messages$.next(message);
  }

  loadAll() {
    this.http.get<IChatRoom[]>('/api/chatroom')
    .subscribe(chatsRooms => {
      this.joinChatRooms(chatsRooms);
    });
  }

  joinChatRooms(chats: IChatRoom[]) {
    this.chatList$.next(chats);
    chats.forEach( cr => this.socketService.joinRoom(cr.id));
  }

  /* put updates */
  updateChatRoom(update: IChatUpdate) {
    this.http.put(`/api/chatroom/${update.roomId}`, update)
    .subscribe(u => {

    });
  }

  /* watches for updates and makes them */
  chatRoomUpdate(update: IChatUpdate) {
   /* if (this.chat[update.roomId]) {
      this.chat[update.roomId].length = 0;
    }*/
    this.update$.next(update);
  }

  getLastMessages(chatId: number, count: number) {
    if (this.chat[chatId]) {
      return this.chat[chatId];
    }
    return [];
  }

  leaveRoom(id: number) {
    this.socketService.leaveRoom(id);
  }

}
