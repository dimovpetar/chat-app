import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';


import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatService } from './chat.service';
import { UserService } from './user.service';
import { SocketService } from './socket.service';
import { InviteUserDialogComponent } from './invite-user-dialog/invite-user-dialog.component';

import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule
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
    InviteUserDialogComponent,
  ],
  entryComponents: [
    InviteUserDialogComponent
  ]
})
export class ProtectedModule { }
