import { Injectable } from '@angular/core';
import { Employee } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  user: Employee;

  constructor() { }

  setUser(userLoggedIn: Employee): void {
    this.user = userLoggedIn;
  }

  getUser(): Employee {
    return this.user;
  }
}
