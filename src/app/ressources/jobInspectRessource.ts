import { RoleRessource } from './userRessource';

export class TaskRessource {
  idTask: number;
  name: string;
  avgTime: number;
  role: RoleRessource;
}

export class CarAreaRessource {
  idCarArea: number;
  code: string;
  carSide: CarSideRessource;
}

export class CarSideRessource {
  idCarSide: number;
  name: string;
}


