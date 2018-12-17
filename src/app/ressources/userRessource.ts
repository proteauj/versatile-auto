export class UserRessource {
  idUser: number;
  email: string;
  name: string;
  type: TypeRessource;
  image: string;
  roles: RoleRessource[];
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
