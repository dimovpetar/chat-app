import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatService } from './chat.service';
import { UserService } from './user.service';
import { ImageUploadService } from './image-upload.service';
import { SocketService } from './socket.service';
import { InviteUserDialogComponent } from './invite-user-dialog/invite-user-dialog.component';

import { FormsModule } from '@angular/forms';
import { ChangeTitleDialogComponent } from './change-title-dialog/change-title-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { ChangeChatPictureDialogComponent } from './change-chat-picture-dialog/change-chat-picture-dialog.component';
import { WelcomeComponent } from './welcome/welcome.component';

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
  ],
  entryComponents: [
    InviteUserDialogComponent,
    ChangeTitleDialogComponent,
    ChangeChatPictureDialogComponent
  ]
})
export class ProtectedModule { }
