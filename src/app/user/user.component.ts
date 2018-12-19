import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Employee, Role, User } from '../models/user';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: Employee;
  public roles: Role[] = [];
  public rolesById: Map<number, Role> = new Map<number, Role>();
  public userForm: FormGroup;
  public userRolesForm;

  public email;
  public name;
  public userRoles;
  public image;

  userRoleSelByRoleId: Map<number, Role> = new Map<number, Role>();

  constructor(private global: GlobalService, private formBuilder: FormBuilder, private userService: UserService,
              private messageService: MessageService, private translate: TranslateService, private router: Router,
              private auth: AuthService) { }

  ngOnInit() {
    var email: string = '';
    var name: string = '';
    var userRoles: Role[];
    var image: string = '';

    this.auth.getUser().subscribe(data => {
      this.user = data;

      if (this.user != null) {
        if (this.user.user != null) {
          email = this.user.user.email;
        }
        name = this.user.name;
        userRoles = this.user.roles;
        image = this.user.image;

        for (let role of userRoles) {
          this.userRoleSelByRoleId.set(role.idRole, role);
        }
      }

      this.email = new FormControl(email, [Validators.required, Validators.email]);
      this.name = new FormControl(name, [Validators.required]);

      this.userForm = this.formBuilder.group({
        email: this.email,
        name: this.name,
        userRoles: new FormControl('', [])

      });

      this.userService.getRoles().then(data => {
        this.roles = data;
        this.userRolesForm = this.buildRoles();
        this.userForm.controls.userRoles = this.formBuilder.group(this.userRolesForm);

        for (let role of this.roles) {
          this.rolesById.set(role.idRole, role);
        }
      });
    });
  }

  buildRoles() {
    var userRoles = {};

    for (let role of this.roles) {
      if (this.userRoleSelByRoleId.get(role.idRole) != null) {
        userRoles[role.idRole] = new FormControl(true);
      } else {
        userRoles[role.idRole] = new FormControl(false);
      }
    }

    return userRoles;
  }

  compareRole(r1: Role, r2: Role): boolean {
    return r1 && r2 ? r1.idRole === r2.idRole : r1 === r2;
  }

  onFileChanged(event) {
    const formdata: FormData = new FormData();
    formdata.append('file', event.target.files);
    //this.user.image = formdata;
    //Appeler createFile et le mettre dans FileService plutôt que JobService
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    var user: User = {
      idUser: this.user.user.idUser,
      email: this.userForm.controls.email.value,
      password: this.user.user.password
    }

    const val = (<any>Object).assign({}, this.userForm.controls.userRoles);
    const chosenRoles = [];
    for (const idRole in val.controls) {

      if (val.controls[idRole].value) {
        var idRoleNumb = parseInt(idRole, 10);
        var role = this.rolesById.get(idRoleNumb);
        chosenRoles.push(role);
      };
    }

    var employee: Employee = {
      user: user,
      name: this.userForm.controls.name.value,
      type: this.user.type,
      image: null,
      roles: chosenRoles
    }

    this.userService.modifyUser(employee).subscribe(data => {
      console.log("POST Modify user is successful ", data);
      this.messageService.showSuccess(this.translate.instant('user.update.success'));
      this.router.navigate(['/user-task']);
    }, error => {
      this.messageService.showError(this.translate.instant('user.update.error'));
    });
  }
}
