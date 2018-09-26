import { CarRessource } from './carRessource';
import { RoleRessource, UserRessource } from './userRessource';

export class JobRessource {
  idJob: number;
  description: string;
  car: CarRessource;
  status: StatusRessource;
}

export class StatusRessource {
  idStatus: number;
  status: string;
}

export class JobTaskRessource {
  id: number;
  name: string;
  time: number;
  job: JobRessource;
  status: StatusRessource;
  priority: number;
  role: RoleRessource;
  user: UserRessource;
}
