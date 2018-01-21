import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatService } from './chat.service';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { UserService } from './user.service';
import { SocketService } from './socket.service';


@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    HomeComponent
  ],
  providers: [
    ChatService,
    UserService,
    SocketService
  ],
  declarations: [
    HomeComponent,
    HeaderComponent,
    ProfileComponent,
    ChatListComponent,
    ChatRoomComponent,
    FriendRequestsComponent]
})
export class ProtectedModule { }
