import { Component, OnInit } from '@angular/core';
import { User, Role, Type, Employee } from '../models/user';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  public categories: Promise<Role[]>;
  public registerForm: FormGroup;

  public firstname;
  public lastname;
  public category;
  public email;
  public password;

  constructor(private userService: UserService, private messageService: MessageService,
              private translate: TranslateService, private router: Router, private formBuilder: FormBuilder,
              private auth: AuthService) { }

  ngOnInit() {
    this.categories = this.userService.getRoles();

    this.firstname = new FormControl('', [Validators.required]);
    this.lastname = new FormControl('', [Validators.required]);
    this.category = new FormControl(null, [Validators.required]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);

    this.registerForm = this.formBuilder.group({
      firstname: this.firstname,
      lastname: this.lastname,
      category: this.category,
      email: this.email,
      password: this.password
    });
  }

  compareCategory(r1: Role, r2: Role): boolean {
    return r1 && r2 ? r1.idRole === r2.idRole : r1 === r2;
  }

  onRegister(): void {
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    var user: User = {
      idUser: null,
      email: this.registerForm.controls.email.value,
      password: this.registerForm.controls.password.value
    }

    var type: Type = {
      idType: 1,
      description: 'Employé'
    }

    var category: Role = {
      idRole: this.registerForm.controls.category.value.idRole,
      description: this.registerForm.controls.category.value.description
    }

    var firstname = this.registerForm.controls.firstname.value;
    var lastname = this.registerForm.controls.lastname.value;

    var employee: Employee = {
      user: user,
      name: firstname + ' ' + lastname,
      role: category,
      type: type,
      image: null
    }

    this.userService.createLogIn(employee).subscribe(data => {
      console.log("POST LogIn is successful ", data);
      this.messageService.showSuccess(this.translate.instant('login.register.success'));
      this.auth.sendToken(employee.user.email);
      this.router.navigate(['/job']);
    }, error => {
      this.messageService.showError(this.translate.instant('login.register.error'));
    });
  }


}
