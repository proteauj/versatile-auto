export class User {
  idUser: number;
  email: string;
  password: string;
}

export class Employee {
  user: User;
  name: string;
  type: Type;
  image: string;
  roles: Role[];
}

export class Role {
  idRole: number;
  description: string;
  checked: boolean = false;
}

export class Type {
  idType: number;
  description: string;
}
