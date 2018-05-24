import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IUser } from '../../../shared/interfaces/user';


@Injectable()
export class RegisterService {

  constructor(private http: HttpClient) { }

  register(user: IUser) {
    return this.http.post<IUser>('/api/register', user);
  }
}
