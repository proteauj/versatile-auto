import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuComponent } from './menu/menu.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { GlobalService } from './global.service';
import { Employee } from './models/user';
import { Router } from '@angular/router';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public user: Employee;
  public email: string;

  constructor(private userService: UserService, private translate: TranslateService, private auth: AuthService,
              private global: GlobalService, private router: Router) {}

  ngOnInit() {
    this.translate.setDefaultLang('fr');

    var email: string = this.auth.getToken();
    this.auth.sendToken(email);
    this.auth.getUser().subscribe(data => {
      this.user = data;
    });

    /*this.userService.getUser(email).subscribe(data => {
      this.user = this.userService.getEmployeeFromRessource(data.body[0]);
      this.global.setUser(this.user);
    });*/

    /*this.tokenSubscribe = this.auth.getToken().subscribe(data => {
      this.email = data;
      this.globalSubscribe = this.global.getUser().subscribe(data2 => {
        this.user = data2;
      });
    });*/


  }

  onUserClick() {
    this.router.navigate(['/user']);
  }

  /*ngOnDestroy() {
    this.tokenSubscribe.unsubscribe();
  }*/
}
