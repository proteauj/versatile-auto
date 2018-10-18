import { CarRessource } from './carRessource';
import { RoleRessource, UserRessource } from './userRessource';

export class JobRessource {
  idJob: number;
  description: string;
  car: CarRessource;
  status: StatusRessource;
  arrivalDate: Date;
  toDeliverDate: Date;
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

export class FileRessource {
  idFile: number;
  file: string;
  name: string;
  type: string;
  job: JobRessource;
}
