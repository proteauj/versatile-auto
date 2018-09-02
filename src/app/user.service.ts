import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  validateUserLogIn(user: User): boolean {
    return (user.email == 'julie.proteau@hotmail.com' && user.password == 'jul123');
  }
}
