import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    validUser: User;
	user: User = {
	    id: null,
        email: '',
        password: ''
	};
	logInTried: boolean = false;

  constructor(private userService: UserService, private messageService: MessageService,
    private translate: TranslateService, private router: Router) { }

  ngOnInit() { }

  onLogIn(user: User): void {
    this.logInTried = true;

    if (this.userService.validateUserLogIn(user)) {
        this.validUser = user;
        this.messageService.add(this.translate.instant('login.success'));//, user.email);
        this.router.navigate(['/job-new']);
    } else {
        this.messageService.add(this.translate.instant('login.fail'));
    }
  }

}
