import { Component, OnInit } from '@angular/core';
import { Job, JobTask } from '../models/job';
import { Employee } from '../models/user';
import { TaskService } from '../task.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html',
  styleUrls: ['./user-task.component.css']
})
export class UserTaskComponent implements OnInit {
  private employee: Employee;
  private userTasks: Promise<JobTask[]>;
  private userJobs: Job[] = [];
  private userJobsMap: Map<number, Job> = new Map<number, Job>();
  private jobTasksMap: Map<number, JobTask[]> = new Map<number, JobTask[]>();

  displayedColumns = ['name', 'time', 'action'];
  dataSource;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private router: Router, private taskService: TaskService, private auth: AuthService) { }

  ngOnInit() {


    this.auth.getUser().subscribe(data => {
      this.employee = data;

      if (this.employee != null) {
        this.userTasks = this.taskService.getUserTasks(this.employee.user.idUser);

        this.taskService.getUserTasks(this.employee.user.idUser).then(data => {
          var userTasks = data;

          for (let userTask of userTasks) {
            var job = userTask.job;
            var idJob = job.idJob;
            var jobTasks: JobTask[] = this.jobTasksMap.get(idJob);

            if (this.userJobsMap.get(idJob) == null) {
              this.userJobsMap.set(idJob, job);
            }

            if (jobTasks != null) {
              jobTasks.push(userTask);
            } else {
              jobTasks = [];
              jobTasks.push(userTask);
              this.jobTasksMap.set(idJob, jobTasks);
            }
          }

          this.userJobs = this.getJobsValues();
        });
      }
    });

  }

  setCurrentJob(idJob: number) {
    this.dataSource = this.jobTasksMap.get(idJob);
  }

  getJobsValues(): Array<Job> {
    return Array.from(this.userJobsMap.values());
  }

  onPlay(idTask: number, idJob: number) {

  }

  onPause(idTask: number, idJob: number) {

  }

  onFinish(idTask: number, idJob: number) {

  }

}
