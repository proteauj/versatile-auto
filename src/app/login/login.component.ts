import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	protected submitted: boolean = false;
	protected isValid;
  protected loginForm: FormGroup;

  constructor(private userService: UserService, private messageService: MessageService,
    private translate: TranslateService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onLogIn(): void {
    this.submitted = true;

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
        this.messageService.showSuccess(this.translate.instant('login.success'));//, user.email);
        this.router.navigate(['/job-new']);
      } else {
        this.messageService.showError(this.translate.instant('login.fail'));
      }
    });
  }
}
