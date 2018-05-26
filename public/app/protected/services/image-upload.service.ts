import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class ImageUploadService {

  constructor(private http: HttpClient) { }

  postUserImage(image: File) {
    const formData: FormData = new FormData();
    formData.append('image', image, image.name);
    return this.http.post('/api/images/user', formData).map( data => data);
  }

  postChatImage(image: File, chatId: number) {
    const formData: FormData = new FormData();
   // const fileName = chatId.toString() + '.' + /(?:\.([^.]+))?$/.exec(image.name)[1];
    formData.append('image', image);
    return this.http.post(`/api/images/chat/${chatId}`, formData).map( data => data);
  }
}


