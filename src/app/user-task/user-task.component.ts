import { Component, OnInit } from '@angular/core';
import { Job, JobTask } from '../models/job';
import { JobTaskActivity, JobTaskModel, JobModel} from '../models/jobTaskActivity';
import { Employee } from '../models/user';
import { TaskService } from '../task.service';
import { TaskActivityService } from '../task-activity.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import * as q from 'q';

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html',
  styleUrls: ['./user-task.component.css']
})
export class UserTaskComponent implements OnInit {
  private employee: Employee;
  private userTasks: Promise<JobTask[]>;
  private userJobs: Job[] = [];
  //Key : idJob
  private userJobsMap: Map<number, Job> = new Map<number, Job>();
  //Key : idJob
  private jobTasksMap: Map<number, JobTask[]> = new Map<number, JobTask[]>();
  //Key : idJobTask
  private jobTasksModelMap: Map<number, JobTaskModel> = new Map<number, JobTaskModel>();

  displayedColumns = ['name', 'part', 'time', 'action'];
  dataSource;

  private jobModels: JobModel[] = [];



  constructor(private messageService: MessageService, private translate: TranslateService,
              private router: Router, private taskService: TaskService, private auth: AuthService,
              private taskActivityService : TaskActivityService) { }

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
            var idJobTask = userTask.id;
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

          for (let job of this.userJobs) {
            var jobTasks = this.jobTasksMap.get(job.idJob);
            var jobTasksModel: JobTaskModel[] = [];

            var promises = [];
            for (let jobTask of jobTasks) {
              var promise = this.taskActivityService.getJobTaskActivities(jobTask);
              promises.push(promise);
            }

            q.all(promises).then(data => {
              for (let jobTaskModel of data) {
                if (jobTaskModel != null) {
                  jobTasksModel.push(jobTaskModel);
                }
              }

              var jobModel = {
                job: job,
                jobTasksModel: jobTasksModel
              }
              this.jobModels.push(jobModel);
            });
          }
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
