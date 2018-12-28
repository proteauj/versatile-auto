import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { JobTaskActivity, JobTaskModel } from './models/jobTaskActivity';
import { JobTask } from './models/job';
import { JobTaskActivityRessource } from './ressources/jobTaskActivityRessource';
import { UserService } from './user.service';
import { TaskService } from './task.service';
import { Observable } from "rxjs";
import { AppConstants} from './app.constants';
import { TimerService } from './timer.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class TaskActivityService {

  //JOB_TASK_ACTIVITY_URL
  //@GetMapping("/jobs/tasks/activities")
  //@PostMapping("/jobs/tasks/activities")

  //JOB_TASK_ACTIVITY_URL + id
  //@PutMapping("/jobs/tasks/activities/{id}")
  //@DeleteMapping("/jobs/tasks/activities/{id}")

  //JOB_TASK_URL + id + ACTIVITY_URL
  //@GetMapping("/jobs/tasks/{id}/activities")

  //JOB_TASK_ACTIVITY_URL + id
  //@GetMapping("/jobs/tasks/activities/{id}")

  //USERS_URL + id + TASK_ACTIVITY_URL
  //@GetMapping("/users/{id}/tasks/activities")

  constructor(private http: HttpClient, private taskService: TaskService, private userService: UserService,
              private timerService: TimerService) { }

  getJobTaskActivitiesRessource(idJobTask: number): Observable<HttpResponse<JobTaskActivityRessource[]>> {
    var url = `${AppConstants.JOB_TASK_URL}/${idJobTask}/${AppConstants.ACTIVITY_URL}`;
    return this.http.get<JobTaskActivityRessource[]>(url, { observe: 'response' });
  }

  async getJobTaskActivities(jobTask: JobTask): Promise<JobTaskModel> {
    var activitiesRess: JobTaskActivityRessource[] = [];
    var activities: JobTaskActivity[] = [];
    var model: JobTaskModel;
    var idJobTask: number = jobTask.id;

    await new Promise(resolve => {
      this.getJobTaskActivitiesRessource(idJobTask).subscribe(resp => {
        activitiesRess = resp.body;

        for (let activityRess of activitiesRess) {
          var activity: JobTaskActivity = this.getJobTaskActivityFromRessource(activityRess);
          activities.push(activity);
        }

        model = this.getJobTaskModel(activities, jobTask);
        resolve(model);
      });
    });

    console.log(activities);
    return model;
  }

  getJobTaskActivityFromRessource(jobTaskActivityRess: JobTaskActivityRessource): JobTaskActivity {
    var jobTaskActivity: JobTaskActivity = {
      id: jobTaskActivityRess.id,
      jobTask: this.taskService.getJobTaskFromRessource(jobTaskActivityRess.jobTask),
      user: this.userService.getEmployeeFromRessource(jobTaskActivityRess.user),
      startTime: moment.utc(jobTaskActivityRess.startTime).local().toDate(),
      endTime: moment.utc(jobTaskActivityRess.endTime).local().toDate()
    };

    return jobTaskActivity;
  }

  getJobTaskActivityRessourceFromModel(jobTaskActivity: JobTaskActivity): JobTaskActivityRessource {
    var jobTaskActivityRessource: JobTaskActivityRessource = {
      id: jobTaskActivity.id,
      jobTask: this.taskService.getJobTaskRessourceFromJobTask(jobTaskActivity.jobTask),
      user: this.userService.getUserRessourceFromEmployee(jobTaskActivity.user),
      startTime: jobTaskActivity.startTime,
      endTime: jobTaskActivity.endTime
    };

    return jobTaskActivityRessource;
  }

  updateElapsedTime(jobTaskActivity: JobTaskActivity, jobTaskModel: JobTaskModel): JobTaskModel {
    var difference = this.timerService.getMinutesDifferenceDate(jobTaskActivity.startTime, jobTaskActivity.endTime);

    if (difference > 0) {
      jobTaskModel.jobTask.elapsedTime = jobTaskModel.jobTask.elapsedTime + difference;
    }

    return jobTaskModel;
  }

  getJobTaskModel(jobTaskActivities: JobTaskActivity[], jobTask: JobTask): JobTaskModel {
    var jobTaskModel: JobTaskModel;

      jobTaskModel = {
        jobTask: jobTask,
        activities: jobTaskActivities,
        isStarted: false,
        isCompleted: false,
        elapsedTime: jobTask.elapsedTime,
        startTime: null
      };

      if (jobTask.status.status == 'FINISHED') {
        jobTaskModel.isCompleted = true;
      }

      for (let jobTaskActivity of jobTaskActivities) {
        if (jobTaskActivity.endTime.toJSON() == null) {
          jobTaskModel.isStarted = true;
          jobTaskModel.startTime = jobTaskActivity.startTime;
        }
      }

    return jobTaskModel;
  }

  createJobTaskActivity(jobTaskActivity: JobTaskActivity): Observable<HttpResponse<JobTaskActivityRessource>> {
    var jobTaskActivityRessource: JobTaskActivityRessource = this.getJobTaskActivityRessourceFromModel(jobTaskActivity);
    var body = JSON.stringify(jobTaskActivityRessource);
    var url = AppConstants.JOB_TASK_ACTIVITY_URL;
    return this.http.post<JobTaskActivityRessource>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  updateJobTaskActivity(jobTaskActivity: JobTaskActivity): Observable<HttpResponse<JobTaskActivityRessource>> {
    var jobTaskActivityRessource: JobTaskActivityRessource = this.getJobTaskActivityRessourceFromModel(jobTaskActivity);
    var body = JSON.stringify(jobTaskActivityRessource);
    var url = `${AppConstants.JOB_TASK_ACTIVITY_URL}/${jobTaskActivity.id}`;
    return this.http.put<JobTaskActivityRessource>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }
}
