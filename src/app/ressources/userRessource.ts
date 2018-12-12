export class UserRessource {
  idUser: number;
  email: string;
  name: string;
  role: RoleRessource;
  type: TypeRessource;
  image: string;
}

export class LogInRessource {
  id: number;
  password: string;
  nbFailedLogin: number;
  user: UserRessource;
}

export class RoleRessource {
  idRole: number;
  description: string;
}

export class TypeRessource {
  idType: number;
  description: string;
}
