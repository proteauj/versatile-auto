import { Component, OnInit } from '@angular/core';
import { Job, JobTask } from '../models/job';
import { JobTaskActivity, JobTaskModel, JobModel} from '../models/jobTaskActivity';
import { Employee } from '../models/user';
import { TaskService } from '../task.service';
import { TaskActivityService } from '../task-activity.service';
import { JobService } from '../job.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import * as q from 'q';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";
import { TimerService } from '../timer.service';

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

  //An employee can works only on one job task at a time
  private jobTaskStarted: JobTask;

  timer:Observable<number>;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private router: Router, private taskService: TaskService, private auth: AuthService,
              private taskActivityService: TaskActivityService, private jobService: JobService,
              private timerService: TimerService) { }

  ngOnInit() {
    this.timerService.setInterval(60000);

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

            var promises = [];
            for (let jobTask of jobTasks) {
              var promise = this.taskActivityService.getJobTaskActivities(jobTask);
              promises.push(promise);
            }

            q.all(promises).then(data => {
              var jobTasksModel: JobTaskModel[] = [];

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

              this.jobTaskStarted = jobTasksModel.filter(jobTaskModel => jobTaskModel.isStarted)[0].jobTask;
              this.setTimerJobTaskStarted();
            });
          }
        });
      }
    });
  }

  setTimerJobTaskStarted() {
    var jobModelIndex = this.jobModels.findIndex(j => j.job.idJob == this.jobTaskStarted.job.idJob);
    var jobTaskModelIndex = this.jobModels[jobModelIndex].jobTasksModel.findIndex(t => t.jobTask.id == this.jobTaskStarted.id);

    var jobTaskModel = this.jobModels[jobModelIndex].jobTasksModel[jobTaskModelIndex];
    var jobTaskActivityIndex = jobTaskModel.activities.findIndex(a => a.endTime.toJSON() == null);
    var startTime = this.jobModels[jobModelIndex].jobTasksModel[jobTaskModelIndex].activities[jobTaskActivityIndex].startTime;

    //Mettre à jour le elapsedTime à partir de la startTime pour la tâche en cours. Ensuite c'est le timer qui l'incrémente
    var minutesDiff = this.timerService.getMinutesDifferenceDate(startTime, new Date());
    jobTaskModel.elapsedTime += minutesDiff;

    this.timerService.setTimeOut(startTime, this.getEndTime())
    this.timer = this.timerService.getObservableTimer();
    this.timer.subscribe(val => {
      jobTaskModel.elapsedTime += 1;
    });
  }

  getEndTime(): Date {
    var endTime = new Date();
    //TODO: Changer pour l'heure habituelle de fin de l'employé
    endTime.setHours(16, 30, 0, 0);
    return endTime;
  }

  setCurrentJob(idJob: number) {
    this.dataSource = this.jobTasksMap.get(idJob);
  }

  getJobsValues(): Array<Job> {
    return Array.from(this.userJobsMap.values());
  }

  updateJobTask(jobTask: JobTask, status: string) {
    var jobModelIndex = this.jobModels.findIndex(j => j.job.idJob == jobTask.job.idJob);
    var jobTaskModelIndex = this.jobModels[jobModelIndex].jobTasksModel.findIndex(t => t.jobTask.id == jobTask.id);

    var jobTaskModel = this.jobModels[jobModelIndex].jobTasksModel[jobTaskModelIndex];
    var jobTaskActivityIndex = jobTaskModel.activities.findIndex(a => a.endTime.toJSON() == null);
    this.jobModels[jobModelIndex].jobTasksModel[jobTaskModelIndex].activities[jobTaskActivityIndex].endTime = new Date();

    var jobTaskActivity = this.jobModels[jobModelIndex].jobTasksModel[jobTaskModelIndex].activities[jobTaskActivityIndex];

    jobTaskModel = this.taskActivityService.updateElapsedTime(jobTaskActivity, jobTaskModel);
    this.jobService.getStatusStr(status).then(data => {
      jobTaskModel.jobTask.status = data;

      var observables = [];
      observables.push(this.taskActivityService.updateJobTaskActivity(jobTaskActivity));
      observables.push(this.taskService.updateTask(jobTaskModel.jobTask));

      forkJoin(observables).subscribe(results => {
        this.jobTaskStarted = null;
        //Le timer doit arrêter de compter les minutes de l'employé
        this.timer = null;
        jobTaskModel.isStarted = false;
        if (status == 'FINISHED') {
          jobTaskModel.isCompleted = true;
        }

        this.jobModels[jobModelIndex].jobTasksModel[jobTaskModelIndex] = jobTaskModel;

        this.messageService.showSuccess(this.translate.instant('usertask.update.success'));
      }, error => {
        this.messageService.showError(this.translate.instant('usertask.update.error'));
      });
    })
  }

  onPlay(jobTaskModel: JobTaskModel) {
    if (this.jobTaskStarted != null) {
      this.updateJobTask(this.jobTaskStarted, 'PAUSED');
    }

    var newJobTaskActivity: JobTaskActivity = {
      id: -1,
      jobTask: jobTaskModel.jobTask,
      user: jobTaskModel.jobTask.user,
      startTime: new Date(),
      endTime: null
    };

    this.jobService.getStatusStr('IN_PROGRESS').then(data => {
      jobTaskModel.jobTask.status = data;

      var observables = [];
      observables.push(this.taskActivityService.createJobTaskActivity(newJobTaskActivity));
      observables.push(this.taskService.updateTask(jobTaskModel.jobTask));

      forkJoin(observables).subscribe(responseList => {
        var jobTaskActivityCreated = this.taskActivityService.getJobTaskActivityFromRessource(responseList[0].body);
        jobTaskModel.activities.push(jobTaskActivityCreated);
        jobTaskModel.isStarted = true;
        this.jobTaskStarted = jobTaskModel.jobTask;
        this.setTimerJobTaskStarted();

        this.messageService.showSuccess(this.translate.instant('usertask.create.success'));
      }, error => {
        this.messageService.showError(this.translate.instant('usertask.create.error'));
      });
    });
  }

  onPause(jobTaskModel: JobTaskModel) {
    var jobTask = jobTaskModel.jobTask;
    this.updateJobTask(jobTask, 'PAUSED');
  }

  onFinish(jobTaskModel: JobTaskModel) {
    var jobTask = jobTaskModel.jobTask;
    this.updateJobTask(jobTask, 'FINISHED');
  }

}
