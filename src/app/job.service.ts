import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Job, Status } from './models/job';
import { JobRessource, StatusRessource } from './ressources/jobRessource';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class JobService implements OnInit {

  protected JOB_BASE_URL : string = 'http://localhost:8080/jobs'
  protected STATUS_BASE_URL : string = 'http://localhost:8080/status'

  constructor(private http: HttpClient) { }

  ngOnInit() { }

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
          var status: Status = {
            id: statusRess.id,
            status: statusRess.status
          };

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
}
