import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";
import { UserService } from './user.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject(undefined);

  constructor(private router: Router, private userService: UserService, private global: GlobalService) { }

  sendToken(token: string) {
    localStorage.removeItem("LoggedInUser");
    localStorage.setItem("LoggedInUser", token);
    this.userService.getUser(token).subscribe(data => {
      this.user.next(this.userService.getEmployeeFromRessource(data.body[0]));
    });

    this.user.subscribe((data) => {
      this.global.setUser(data);
    });
  }

  getToken() {
    return localStorage.getItem("LoggedInUser");
  }

  getUser() {
    return this.user.asObservable();
  }

  isLoggednIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem("LoggedInUser");
    this.router.navigate(['/login']);
  }
}
