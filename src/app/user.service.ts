import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { User, Role, Type, Employee } from './models/user';
import { UserRessource, LogInRessource, RoleRessource } from './ressources/userRessource';
import { Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  protected BASE_URL : string = 'http://localhost:8080/users'
  protected emailParam : string = '?email=';
  protected urlLogIns : string = '/logIns';
  protected urlRoles : string = '/roles';
  protected user;
  protected logIn;

  constructor(private http: HttpClient, public sanitizer: DomSanitizer) { }

  ngOnInit() { }

  async validateUserLogIn(user: User): Promise<boolean> {
    await new Promise(resolve => {
      this.getUser(user.email).subscribe(resp => {
        this.user = resp.body[0];
        this.getLogInUser(this.user.idUser).subscribe(resp => {
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

    getRoleRessource(): Observable<HttpResponse<RoleRessource[]>> {
      return this.http.get<RoleRessource[]>(`${this.BASE_URL}${this.urlRoles}`, { observe: 'response' });
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
      return this.http.get<UserRessource[]>(`${this.BASE_URL}${this.urlRoles}/${role.idRole}`, { observe: 'response' });
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
