import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { User } from '../interfaces/user';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  get isLoggedIn() {
    return localStorage.getItem('authToken');
  }

  login(user: User) {
    return this.http.post<User>('http://localhost:3000/login', user)
    .map(data => {
        if (data && data.authToken) {
            localStorage.setItem('username', data.username);
            localStorage.setItem('authToken', data.authToken);
        }
        return data;
    });
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

}
