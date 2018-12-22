import { JobTaskRessource } from './jobRessource';
import { UserRessource } from './userRessource';

export class JobTaskActivityRessource {
  id: number;
  jobTask: JobTaskRessource;
  user: UserRessource;
  startTime: Date;
  endTime: Date;
}
