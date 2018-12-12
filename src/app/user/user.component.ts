import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { UserService } from '../user.service';
import { Employee, Role } from '../models/user';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: Employee;
  public roles: Promise<Role[]>;
  public userForm: FormGroup;

  public email;
  public name;
  public role;
  public image;

  constructor(private global: GlobalService, private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    var email: string = '';
    var name: string = '';
    var role: Role;
    var image: string = '';

    this.roles = this.userService.getRoles();

    this.user = this.global.getUser();

    if (this.user != null) {
      if (this.user.user != null) {
        email = this.user.user.email;
      }
      name = this.user.name;
      role = this.user.role;
      image = this.user.image;
    }


    this.email = new FormControl(email, [Validators.required, Validators.email]);
    this.name = new FormControl(name, [Validators.required]);
    this.role = new FormControl(role, [Validators.required]);
    //this.image = new FormControl(image, []);

    this.userForm = this.formBuilder.group({
      email: this.email,
      name: this.name,
      role: this.role,
      //image: this.image
    });
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
}
