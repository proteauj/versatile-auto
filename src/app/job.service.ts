import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Job, Task, Status } from './models/job';
import { JobRessource, JobTaskRessource, StatusRessource } from './ressources/jobRessource';
import { Observable } from "rxjs";
import { CarService } from './car.service';


@Injectable({
  providedIn: 'root'
})
export class JobService implements OnInit {

  protected JOB_BASE_URL : string = 'http://localhost:8080/jobs'
  protected TASK_URL : string = '/tasks'
  protected STATUS_BASE_URL : string = 'http://localhost:8080/status'

  constructor(private http: HttpClient, private carService: CarService) { }

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

  async getJobTasks(idJob: number): Promise<Task[]> {

  }

  async updateTask(idTask: number): Promise<Task> {

  }

  async deleteTask(idTask: number): Promise<Task> {

  }

  getStatusRessource(): Observable<HttpResponse<StatusRessource[]>> {
    return this.http.get<StatusRessource[]>(`${this.STATUS_BASE_URL}`, { observe: 'response' });
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
      var url = this.JOB_BASE_URL + this.TASK_URL;
      return this.http.post<JobTaskRessource>(url, body,{ headers: headers, observe: 'response' });
    }
}
