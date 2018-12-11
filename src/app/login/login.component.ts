import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	private isValid;
  public loginForm: FormGroup;

  public email;
  public password;

  constructor(private userService: UserService, private messageService: MessageService,
              private translate: TranslateService, private router: Router, private formBuilder: FormBuilder,
              private auth: AuthService) { }

  ngOnInit() {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  onLogIn(): void {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    var user: User = {
      idUser: null,
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    };

    this.userService.validateUserLogIn(user).then(value => {
      this.isValid = value;

      if (this.isValid) {
        this.messageService.showSuccess(this.translate.instant('login.success'));
        this.auth.sendToken(user.email);
        this.router.navigate(['/job-new']);
      } else {
        this.messageService.showError(this.translate.instant('login.fail'));
      }
    });
  }
}
