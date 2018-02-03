import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class ImageUploadService {

  constructor(private http: HttpClient) { }

  postImage(image: File) {
    const formData: FormData = new FormData();
    const fileName = localStorage.getItem('username') + '.jpg';
    formData.append('image', image, fileName);
    return this.http.post('/api/images/avatar', formData).map( data => data);
  }
}


