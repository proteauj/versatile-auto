import { Car } from './car';
import { Role, Employee } from './user';

export class Job {
  idJob: number;
  description: string;
  car: Car;
  status: Status;
}

export class Status {
  idStatus: number;
  status: string;
}

export class Task {
  id: number;
  name: string;
  time: number;
  job: Job;
  status: Status;
  priority: number;
  role: Role;
  user: Employee;
}

export class FileModel {
  id: number;
  file: string;
  name: string;
  type: string;
  job: Job;
  url: SafeResourceUrl;
  isImage: boolean;
}
