import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IChatRoom, IChatMessage, IChatHash, IChatUpdate } from '../../../../shared/interfaces/chatroom';
import { SocketService } from './socket.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';


@Injectable()
export class ChatService {
  public chatList$:  Subject<IChatRoom[]> = new Subject<IChatRoom[]>();
  public update$:   Subject<IChatUpdate> = new Subject<IChatUpdate>();
  private subscription:  Subscription;

  constructor(private http: HttpClient, private socketService: SocketService) {

    this.subscription = socketService.newRoom()
    .subscribe(
      (chat: IChatRoom) => {
        this.joinChatRooms([chat]);
        return chat;
      },
      err => console.log(err)
    );
  }

  createChatRoom() {
    this.http.post('/api/chatroom', {})
    .subscribe(
      data => {},
      err => console.log(err)
    );
  }

  loadAll() {
    this.http.get<IChatRoom[]>('/api/chatroom')
    .subscribe(
      chatRooms => this.joinChatRooms(chatRooms),
      err => console.log(err)
    );
  }

  joinChatRooms(chats: IChatRoom[]) {
    this.chatList$.next(chats);
    chats.forEach( cr => this.socketService.joinRoom(cr.id));
  }

  /* put updates */
  updateChatRoom(update: IChatUpdate) {
    this.http.put(`/api/chatroom/${update.roomId}`, update)
    .subscribe(
      upd => { },
      err => console.log(err)
    );
  }

  updateChatRoomMembership( update: IChatUpdate) {
    this.http.put(`/api/chatroom/membership/${update.roomId}`, update)
    .subscribe(
      upd => { },
      err => console.log(err)
    );
  }

  getMessagesBefore(date: Date, chatId: number) {
    const params = new HttpParams().set('date', date.toString());
    return this.http.get(`/api/chatroom/${chatId}`, {params: params});
  }

  loadMembers(chatId: number) {
    return this.http.get(`api/chatroom/members/${chatId}`);
  }

}
