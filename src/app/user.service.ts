import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { User, Role, Type, Employee } from './models/user';
import { UserRessource, LogInRessource, RoleRessource, TypeRessource } from './ressources/userRessource';
import { Observable } from "rxjs";
import { AppConstants} from './app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  protected user;
  protected logIn;

  constructor(private http: HttpClient, public sanitizer: DomSanitizer) { }

  ngOnInit() { }

  async validateUserLogIn(user: User): Promise<boolean> {
    await new Promise(resolve => {
      this.getUser(user.email).subscribe(resp => {
        this.user = resp.body[0];
        if (this.user != null) {
          this.getLogInUser(this.user.idUser).subscribe(resp => {
            this.logIn = resp.body;
            resolve();
          });
        } else {
          resolve();
        }
      });
    });

    return (this.user != null && this.logIn != null &&
        user.email == this.user.email && user.password == this.logIn.password);
  }

    // Rest Items Service: Read all REST Items
    getUser(email: string): Observable<HttpResponse<UserRessource>> {
      return this.http.get<UserRessource>(`${AppConstants.USERS_URL}${AppConstants.EMAIL_PARAM}${email}`, { observe: 'response' });
    }

    // Rest Items Service: Read all REST Items
    getLogInUser(idUser: number): Observable<HttpResponse<LogInRessource>> {
      return this.http.get<LogInRessource>(`${AppConstants.USERS_URL}/${idUser}${AppConstants.LOG_INS_URL}`, { observe: 'response' });
    }

    getRoleRessource(): Observable<HttpResponse<RoleRessource[]>> {
      return this.http.get<RoleRessource[]>(`${AppConstants.USERS_URL}${AppConstants.ROLES_URL}`, { observe: 'response' });
    }

    getRoleFromRessource(roleRess: RoleRessource): Role {
      var role: Role = {
        idRole: roleRess.idRole,
        description: roleRess.description
      };

      return role;
    }

    getTypeFromRessource(typeRess: TypeRessource): Type {
      var type: Type = {
        idType: typeRess.idType,
        description: typeRess.description
      };

      return type;
    }

    getUserFromRessource(userRess: UserRessource): User {
      var user: User;

       if (userRess != null) {
        user = {
          idUser: userRess.idUser,
          email: userRess.email,
          //Email is only in logInRessource and not required in employee
          password: null
        };
      }

      return user;
    }

    getEmployeeFromRessource(userRess: UserRessource): Employee {
      var employee: Employee;

      if (userRess != null) {
        employee = {
          user: this.getUserFromRessource(userRess),
          name: userRess.name,
          role: this.getRoleFromRessource(userRess.role),
          type: this.getTypeFromRessource(userRess.type),
          image: userRess.image
        };
      }

      return employee;
    }

    async getRoles(): Promise<Role[]> {
      var rolesRessArray: RoleRessource[] = [];
      var rolesArray: Role[] = [];

      await new Promise(resolve => {
        this.getRoleRessource().subscribe(resp => {
          rolesRessArray = resp.body;

          for (let roleRess of rolesRessArray) {
            var role: Role = this.getRoleFromRessource(roleRess);
            rolesArray.push(role);
          }
          resolve();
        });
      });
      return rolesArray;
    }

    getUsersByRoleRessource(role: Role): Observable<HttpResponse<UserRessource[]>> {
      return this.http.get<UserRessource[]>(`${AppConstants.USERS_URL}${AppConstants.ROLES_URL}/${role.idRole}`, { observe: 'response' });
    }

    async getEmployeesByRole(role: Role): Promise<Employee[]> {
      var userRessArray: UserRessource[] = [];
      var employeesArray: Employee[] = [];

      await new Promise(resolve => {
        this.getUsersByRoleRessource(role).subscribe(resp => {
          userRessArray = resp.body;

          for (let userRess of userRessArray) {
            var employee = this.getEmployeeFromRessource(userRess);
            employeesArray.push(employee);
          }
          resolve();
        });
      });
      return employeesArray;
    }

    getEmployeesRessource(): Observable<HttpResponse<UserRessource[]>> {
      return this.http.get<UserRessource[]>(`${AppConstants.USERS_URL}`, { observe: 'response' });
    }

    async getEmployees(): Promise<Employee[]> {
      var userRessArray: UserRessource[] = [];
      var employeesArray: Employee[] = [];

      await new Promise(resolve => {
        this.getEmployeesRessource().subscribe(resp => {
          userRessArray = resp.body;

          for (let userRess of userRessArray) {
            var employee = this.getEmployeeFromRessource(userRess);
            employeesArray.push(employee);
          }
          resolve();
        });
      });
      return employeesArray;
    }

  getTypeRessourceFromType(type: Type): TypeRessource {
    var typeRessource: TypeRessource = {
      idType: type.idType,
      description: type.description
    }

    return typeRessource;
  }

  getRoleRessourceFromRole(role: Role): RoleRessource {
    var roleRessource: RoleRessource = {
      idRole: role.idRole,
      description: role.description
    }

    return roleRessource;
  }

  getUserRessourceFromEmployee(employee: Employee): UserRessource {
    var userRessource: UserRessource = {
      idUser: employee.user.idUser,
      email: employee.user.email,
      name: employee.name,
      role: this.getRoleRessourceFromRole(employee.role),
      type: this.getTypeRessourceFromType(employee.type),
      image: employee.image
    }

    return userRessource;
  }

  getLogInRessourceFromEmployee(employee: Employee): LogInRessource {
    var logInRess: LogInRessource = {
      id: null,
      password: employee.user.password,
      nbFailedLogin: 0,
      user: this.getUserRessourceFromEmployee(employee)
    }

    return logInRess;
  }

  createLogIn(employee: Employee): Observable<HttpResponse<LogInRessource>> {
    var logInRess = this.getLogInRessourceFromEmployee(employee);
    var body = JSON.stringify(logInRess);
    var url = AppConstants.API_BASE_URL + AppConstants.LOG_INS_URL;
    return this.http.post<LogInRessource>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  modifyUser(employee: Employee): Observable<HttpResponse<UserRessource>> {
    var userRess = this.getUserRessourceFromEmployee(employee);
    var body = JSON.stringify(userRess);
    var url = AppConstants.USERS_URL + '/' + userRess.idUser;
    return this.http.put<UserRessource>(url, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }
}
