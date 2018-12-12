export class User {
  idUser: number;
  email: string;
  password: string;
}

export class Employee {
  user: User;
  name: string;
  role: Role;
  type: Type;
  image: string;
}

export class Role {
  idRole: number;
  description: string;
}

export class Type {
  idType: number;
  description: string;
}
