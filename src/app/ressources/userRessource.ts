export class UserRessource {
  id: number;
  email: string;
  name: string;
  idRole: number;
  idUserType: number;
}

export class LogInRessource {
  id: number;
  password: string;
  nbFailedLogin: number;
  user: UserRessource;
}
