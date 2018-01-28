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
import { ChangeTitleDialogComponent } from './change-title-dialog/change-title-dialog.component';
import { SettingsComponent } from './settings/settings.component';

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
    ChangeTitleDialogComponent,
    SettingsComponent,
  ],
  entryComponents: [
    InviteUserDialogComponent,
    ChangeTitleDialogComponent
  ]
})
export class ProtectedModule { }
