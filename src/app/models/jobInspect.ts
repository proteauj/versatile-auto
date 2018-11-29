import { Role } from './user';

export class Task {
  idTask: number;
  name: string;
  avgTime: number;
  role: Role;
  checked: boolean = false;
}

export class CarArea {
  idCarArea: number;
  code: string;
  carSide: CarSide;
}

export class CarSide {
  idCarSide: number;
  name: string;
}
