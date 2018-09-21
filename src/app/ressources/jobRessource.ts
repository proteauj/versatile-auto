import { CarRessource } from './carRessource';

export class JobRessource {
  id: number;
  description: string;
  car: CarRessource;
  status: StatusRessource;
}

export class StatusRessource {
  id: number;
  status: string;
}
