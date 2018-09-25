import { Car } from './car';
import { Role, Employee } from './user';

export class Job {
  id: number;
  description: string;
  car: Car;
  status: Status;
}

export class Status {
  id: number;
  status: string;
}

export class Task {
  id: number;
  name: string;
  time: number;
  priority: number;
  category: Role;
  assignation: Employee;
  status: Status;
}
