export class UserRessource {
  id: number;
  email: string;
  name: string;
  role: RoleRessource;
  type: TypeRessource;
}

export class LogInRessource {
  id: number;
  password: string;
  nbFailedLogin: number;
  user: UserRessource;
}

export class RoleRessource {
  id_role: number;
  description: string;
}

export class TypeRessource {
  id_type: number;
  description: string;
}
