import { CarRessource } from './carRessource';
import { RoleRessource, UserRessource } from './userRessource';
import { TaskRessource, CarAreaRessource } from './jobInspectRessource';

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
  estimatedTime: number;
  job: JobRessource;
  status: StatusRessource;
  priority: number;
  role: RoleRessource;
  user: UserRessource;
  task: TaskRessource;
  elapsedTime: number;
  carArea: CarAreaRessource;
}

export class FileRessource {
  idFile: number;
  file: string;
  name: string;
  job: JobRessource;
  type: string;
}
