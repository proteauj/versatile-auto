import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Job, Task, Status } from './models/job';
import { JobRessource, JobTaskRessource, StatusRessource } from './ressources/jobRessource';
import { Observable } from "rxjs";
import { CarService } from './car.service';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class JobService implements OnInit {

  protected JOB_BASE_URL : string = 'http://localhost:8080/jobs';
  protected TASK_URL : string = '/tasks';
  protected STATUS_BASE_URL : string = 'http://localhost:8080/status';

  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
    observe: 'response'
  };

  constructor(private http: HttpClient, private carService: CarService, private userService: UserService) { }

  ngOnInit() { }

  getJobRessource(idJob: number): Observable<HttpResponse<JobRessource>> {
    return this.http.get<JobRessource>(`${this.JOB_BASE_URL}/${idJob}`, { observe: 'response' });
  }

  getStatusFromRessource(statusRess: StatusRessource): Status {
    var status: Status = {
      idStatus: statusRess.idStatus,
      status: statusRess.status
    };

    return status;
  }

  getJobFromRessource(jobRess: JobRessource): Job {
    var job: Job = {
      idJob: jobRess.idJob,
      description: jobRess.description,
      car: this.carService.getCarFromRessource(jobRess.car),
      status: this.getStatusFromRessource(jobRess.status)
    };

    return job;
  }

  getTaskFromRessource(taskRess: JobTaskRessource): Task {
    var task: Task = {
      id: taskRess.id,
      name: taskRess.name,
      time: taskRess.time,
      job: this.getJobFromRessource(taskRess.job),
      status: this.getStatusFromRessource(taskRess.status),
      priority: taskRess.priority,
      role: this.userService.getRoleFromRessource(taskRess.role)
    };

    if (taskRess.user != undefined) {
      task.user = this.userService.getEmployeeFromRessource(taskRess.user);
    }

    return task;
  }

  async getJob(idJob: number): Promise<Job> {
    var jobRess: JobRessource;
    var job: Job;

    await new Promise(resolve => {
      this.getJobRessource(idJob).subscribe(resp => {
        jobRess = resp.body;
        job = this.getJobFromRessource(jobRess);
        resolve();
      });
    });

    console.log(job);
    return job;
  }

  getJobTasksRessource(idJob: number): Observable<HttpResponse<JobTaskRessource[]>> {
    return this.http.get<JobTaskRessource[]>(`${this.JOB_BASE_URL}/${idJob}${this.TASK_URL}`, this.httpOptions);
  }

  async getJobTasks(idJob: number): Promise<Task[]> {
    var tasksRessArray: JobTaskRessource[] = [];
    var tasksArray: Task[] = [];

    await new Promise(resolve => {
      this.getJobTasksRessource(idJob).subscribe(resp => {
        tasksRessArray = resp.body;

        for (let taskRess of tasksRessArray) {
          var task = this.getTaskFromRessource(taskRess);
          tasksArray.push(task);
        }
        resolve();
      });
    });

    console.log(tasksArray);
    return tasksArray;
  }

  updateTask(task: Task): Observable<HttpResponse<JobTaskRessource>> {
    var body = JSON.stringify(task);
    var url = `${this.JOB_BASE_URL}${this.TASK_URL}/${task.id}`;
    return this.http.put<JobTaskRessource>(url, body, this.httpOptions);
  }

  deleteTask(idTask: number) {
    var url = `${this.JOB_BASE_URL}${this.TASK_URL}/${idTask}`;
    this.http.delete<>(url, this.httpOptions);
  }

  getStatusRessource(): Observable<HttpResponse<StatusRessource[]>> {
    return this.http.get<StatusRessource[]>(`${this.STATUS_BASE_URL}`, this.httpOptions);
  }

  async getStatus(): Promise<Status[]> {
    var statusRessArray: StatusRessource[] = [];
    var statusArray: Status[] = [];

    await new Promise(resolve => {
      this.getStatusRessource().subscribe(resp => {
        statusRessArray = resp.body;

        for (let statusRess of statusRessArray) {
          var status = this.getStatusFromRessource(statusRess);
          statusArray.push(status);
        }
        resolve();
      });
    });

    console.log(statusArray);
    return statusArray;
  }

  createJob(job: Job): Observable<HttpResponse<JobRessource>> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    var body = JSON.stringify(job);
    var url = this.JOB_BASE_URL;
    return this.http.post<JobRessource>(url, body,{ headers: headers, observe: 'response' });
  }

  createTask(task: Task): Observable<HttpResponse<JobTaskRessource>> {
      const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
      var body = JSON.stringify(task);
      var url = `${this.JOB_BASE_URL}${this.TASK_URL}`;
      return this.http.post<JobTaskRessource>(url, body,{ headers: headers, observe: 'response' });
    }
}
