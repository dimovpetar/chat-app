import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../interfaces/user';


@Injectable()
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post('http://localhost:3000/register', user);
  }
}
