import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { User } from './models/user';
import { UserRessource, LogInRessource } from './ressources/userRessource';
import { Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  protected BASE_URL : string = 'http://localhost:8080/users'
  protected emailParam : string = '?email=';
  protected urlLogIns : string = '/logIns';
  protected user;
  protected logIn;

  constructor(private http: HttpClient, public sanitizer: DomSanitizer) { }

  ngOnInit() { }

  async validateUserLogIn(user: User): Promise<boolean> {
    await new Promise(resolve => {
      this.getUser(user.email).subscribe(resp => {
        this.user = resp.body[0];
        this.getLogInUser(this.user.id).subscribe(resp => {
          this.logIn = resp.body;
          resolve();
        });
      });
    });

    return (this.user != null && this.logIn != null &&
        user.email == this.user.email && user.password == this.logIn.password);
  }

    // Rest Items Service: Read all REST Items
    getUser(email: string): Observable<HttpResponse<UserRessource>> {
      return this.http.get<UserRessource>(`${this.BASE_URL}${this.emailParam}${email}`, { observe: 'response' });
    }

    // Rest Items Service: Read all REST Items
    getLogInUser(idUser: number): Observable<HttpResponse<LogInRessource>> {
      return this.http.get<LogInRessource>(`${this.BASE_URL}/${idUser}${this.urlLogIns}`, { observe: 'response' });
    }
}
