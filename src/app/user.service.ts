import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
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

    getEmployeeFromRessource(userRess: UserRessource): Employee {
      var employee: Employee = {
        idUser: userRess.idUser,
        name: userRess.name,
        role: this.getRoleFromRessource(userRess.role),
        type: this.getTypeFromRessource(userRess.type)
      };

      return employee;
    }

    async getRoles(): Promise<Role[]> {
      var rolesRessArray: RoleRessource[] = [];
      var rolesArray: Role[] = [];

      await new Promise(resolve => {
        this.getRoleRessource().subscribe(resp => {
          rolesRessArray = resp.body;

          for (let roleRess of rolesRessArray) {
            var role: Role = {
              idRole: roleRess.idRole,
              description: roleRess.description
            };

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
            var role: Role = {
              idRole: userRess.role.idRole,
              description: userRess.role.description
            }

            var type: Type = {
              idType: userRess.type.idType,
              description: userRess.type.description
            }

            var employee: Employee = {
              idUser: userRess.idUser,
              name: userRess.name,
              role: role,
              type: type
            };

            employeesArray.push(employee);
          }
          resolve();
        });
      });
      return employeesArray;
    }
}
