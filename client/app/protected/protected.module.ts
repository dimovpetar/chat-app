import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { SettingsComponent } from './settings/settings.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MessageInputComponent } from './message-input/message-input.component';
import { ChatService, UserService, SocketService, ImageUploadService} from './services';
import {
  InviteUserDialogComponent,
  ChangeTitleDialogComponent,
  ChangeChatPictureDialogComponent,
  LeaveRoomDialogComponent } from './dialogs';

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
    SocketService,
    ImageUploadService
  ],
  declarations: [
    HomeComponent,
    ProfileComponent,
    ChatListComponent,
    ChatRoomComponent,
    InviteUserDialogComponent,
    ChangeTitleDialogComponent,
    SettingsComponent,
    ChangeChatPictureDialogComponent,
    WelcomeComponent,
    MessageInputComponent,
    LeaveRoomDialogComponent
  ],
  entryComponents: [
    InviteUserDialogComponent,
    ChangeTitleDialogComponent,
    ChangeChatPictureDialogComponent,
    LeaveRoomDialogComponent
  ]
})
export class ProtectedModule { }
