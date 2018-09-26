export class User {
  idUser: number;
  email: string;
  password: string;
}

export class Employee {
  idUser: number;
  name: string;
  role: Role;
  type: Type;
}

export class Role {
  idRole: number;
  description: string;
}

export class Type {
  idType: number;
  description: string;
}
