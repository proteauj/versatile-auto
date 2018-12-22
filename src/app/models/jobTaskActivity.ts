import { Job, JobTask } from './job';
import { Employee } from './user';

export class JobTaskActivity {
    id: number;
    jobTask: JobTask;
    user: Employee;
    startTime: Date;
    endTime: Date;
}

export class JobTaskModel {
  jobTask: JobTask;
  activities: JobTaskActivity[];
  isStarted: boolean;
  isCompleted: boolean;
  elapsedTime: number;
}

export class JobModel {
  job: Job;
  jobTasksModel: JobTaskModel[];
}
