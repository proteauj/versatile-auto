import { Car } from './car';
import { Role, Employee } from './user';
import { Task, CarArea } from './jobInspect';
import { SafeResourceUrl } from '@angular/platform-browser';

export class Job {
  idJob: number;
  description: string;
  car: Car;
  status: Status;
  arrivalDate: Date;
  toDeliverDate: Date;
  carUrl: SafeResourceUrl;
}

export class Status {
  idStatus: number;
  status: string;
}

export class JobTask {
  id: number;
  name: string;
  estimatedTime: number;
  job: Job;
  status: Status;
  priority: number;
  role: Role;
  user: Employee;
  task: Task;
  elapsedTime: number;
  carArea: CarArea;
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

export class JobModel {
  job: Job;
  jobTasks: JobTask[];
}
