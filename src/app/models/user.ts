export class User {
  id: number;
  email: string;
  password: string;
}

export class Employee {
  id: number;
  name: string;
  role: Role;
  type: Type;
}

export class Role {
  id: number;
  description: string;
}

export class Type {
  id: number;
  description: string;
}
