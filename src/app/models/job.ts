import { Car } from './car';

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
