import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { User } from './models/user';
import { UserRessource, LogInRessource } from './ressources/userRessource';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  protected BASE_URL : string = 'http://localhost:8080/users'
  protected emailParam : string = '?email=';
  protected urlLogIns : string = '/logIns';

  constructor(private http: HttpClient, public sanitizer: DomSanitizer) { }

  ngOnInit() { }

  validateUserLogIn(user: User): boolean {
    var userRess = this.getUser(user.email);
    var logInRess = this.getLogInUser(userRess);

    return (userRess != null && logInRess != null &&
        user.email == userRess.email && user.password == logInRess.password);
  }

    // Rest Items Service: Read all REST Items
    getUser(email: string): UserRessource {
      var user;
      this.http.get(`${this.BASE_URL}${this.emailParam}${email}`).subscribe((data: UserRessource) => {
        user = data;
      });
      return user;
    }

    // Rest Items Service: Read all REST Items
    getLogInUser(userRess: UserRessource): LogInRessource {
      var logIn;
      this.http.get(`${this.BASE_URL}/{id}/${this.urlLogIns}`).subscribe((data: LogInRessource) => {
        logIn = data;
      });
      return logIn;
    }
}
