import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IChatMessage } from '../../../../shared/interfaces/chatroom';


@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent implements OnInit {
  @Output() message: EventEmitter<IChatMessage> = new EventEmitter<IChatMessage> ();
  public messageBuffer = '';

  constructor() {
  }

  ngOnInit() {
  }

  sendTextMessage() {

    const chatMessage: IChatMessage = {
      roomId: 0,
      sender: localStorage.getItem('username'),
      senderProfilePicture: localStorage.getItem('profilePicture'),
      text: this.messageBuffer,
      createdAt: new Date(),
      messageType: 'text'
    };

    this.message.emit(chatMessage);
    this.messageBuffer = '';
  }

  sendFileMessage(files: FileList) {

    const fileReader = new FileReader();
    const message = this.message;
    fileReader.readAsArrayBuffer(files[0]);
    fileReader.onload = function () {

      const chatMessage: IChatMessage = {
        roomId: 0,
        sender: localStorage.getItem('username'),
        senderProfilePicture: localStorage.getItem('profilePicture'),
        createdAt: new Date(),
        text: '',
        messageType: 'image',
        image: fileReader.result
      };

      message.emit(chatMessage);
    };
  }



}
