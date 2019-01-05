import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Job, Status, FileModel } from './models/job';
import { Car } from './models/car';
import { JobRessource, StatusRessource, FileRessource } from './ressources/jobRessource';
import { Observable } from "rxjs";
import { CarService } from './car.service';
import { UserService } from './user.service';
import { ClientService } from './client.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppConstants} from './app.constants';

@Injectable({
  providedIn: 'root'
})
export class JobService implements OnInit {

  constructor(private http: HttpClient, private carService: CarService, private userService: UserService,
              private sanitizer: DomSanitizer, private clientService: ClientService) { }

  ngOnInit() { }

  getStatusFromRessource(statusRess: StatusRessource): Status {
    var status: Status = {
      idStatus: statusRess.idStatus,
      status: statusRess.status
    };

    return status;
  }

  getStatusRessourceFromModel(status: Status): StatusRessource {
    var statusRess: StatusRessource = {
      idStatus: status.idStatus,
      status: status.status
    };

    return statusRess;
  }

  getJobFromRessource(jobRess: JobRessource): Job {
    var job: Job = {
      idJob: jobRess.idJob,
      description: jobRess.description,
      car: this.carService.getCarFromRessource(jobRess.car),
      status: this.getStatusFromRessource(jobRess.status),
      client: this.clientService.getClientFromRessource(jobRess.client),
      numJobClient: jobRess.numJobClient,
      arrivalDate: new Date(jobRess.arrivalDate),
      toDeliverDate: new Date(jobRess.toDeliverDate),
      carUrl: null
    };

    this.getCarImage(job.car).then(data => {
       job.carUrl = data;
    });

    return job;
  }

  getJobRessourceFromModel(job: Job): JobRessource {
    var jobRess: JobRessource = {
      idJob: job.idJob,
      description: job.description,
      car: this.carService.getCarRessourceFromModel(job.car),
      status: this.getStatusRessourceFromModel(job.status),
      client: this.clientService.getClientRessourceFromModel(job.client),
      numJobClient: job.numJobClient,
      arrivalDate: new Date(job.arrivalDate),
      toDeliverDate: new Date(job.toDeliverDate)
    };

    return jobRess;
  }

 base64ToArrayBuffer(base64): Uint8Array {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
       var ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    return bytes;
 }

  getUrl(file: Uint8Array, type: string): SafeResourceUrl {
    const blob = new Blob([file], { type: type });
    var fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    return fileUrl;
  }

  getFileFromRessource(fileRess: FileRessource): FileModel {
    var file: FileModel = {
      id: fileRess.idFile,
      name: fileRess.name,
      type: fileRess.type,
      file: fileRess.file,
      job: this.getJobFromRessource(fileRess.job),
      url: null,
      isImage: fileRess.type.includes('image')
    }

    file.url = this.getUrl(this.base64ToArrayBuffer(file.file), file.type);

    return file;
  }

  getJobsRessource(): Observable<HttpResponse<JobRessource[]>> {
    return this.http.get<JobRessource[]>(`${AppConstants.JOB_BASE_URL}`, { observe: 'response' });
  }

  async getJobs(): Promise<Job[]> {
    var jobsRess: JobRessource[] = [];
    var jobs: Job[] = [];

    await new Promise(resolve => {
      this.getJobsRessource().subscribe(resp => {
        jobsRess = resp.body;

        for (let jobRess of jobsRess) {
          var job: Job = this.getJobFromRessource(jobRess);
          jobs.push(job);
        }
        resolve();
      });
    });

    console.log(jobs);
    return jobs;
  }

  getJobRessource(idJob: number): Observable<HttpResponse<JobRessource>> {
    return this.http.get<JobRessource>(`${AppConstants.JOB_BASE_URL}/${idJob}`, { observe: 'response' });
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

  getStatusRessource(): Observable<HttpResponse<StatusRessource[]>> {
    return this.http.get<StatusRessource[]>(`${AppConstants.STATUS_BASE_URL}`,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  getStatusStrRessource(status:string): Observable<HttpResponse<StatusRessource[]>> {
    var url = `${AppConstants.STATUS_BASE_URL}${AppConstants.STATUS_PARAM}${status}`;
    return this.http.get<StatusRessource[]>(url,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  async getStatusStr(statusStr:string): Promise<Status> {
    var status:Status;

    await new Promise(resolve => {
      this.getStatusStrRessource(statusStr).subscribe(resp => {
        status = this.getStatusFromRessource(resp.body[0]);
        resolve();
      });
    });

    return status;
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
    var body = JSON.stringify(job);
    var url = AppConstants.JOB_BASE_URL;
    return this.http.post<JobRessource>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  updateJob(job: Job): Observable<HttpResponse<JobRessource>> {
     var body = JSON.stringify(job);
     var url = `${AppConstants.JOB_BASE_URL}/${job.idJob}`;
     return this.http.put<JobRessource>(url, body,
       { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  createFiles(files: File[], idJob: number): Observable<HttpResponse<FileRessource[]>> {
    var url = AppConstants.JOB_BASE_URL + '/' + idJob + AppConstants.FILES_URL;

    const formdata: FormData = new FormData();

    for (let file of files) {
      formdata.append('file', file);
    }

    return this.http.post<FileRessource[]>(url, formdata, {
      headers: new HttpHeaders({ 'Accept': 'application/json;' }),
      observe: 'response'
    });
  }

  getFilesRessource(idJob: number): Observable<HttpResponse<FileRessource[]>> {
    var url = AppConstants.JOB_BASE_URL + '/' + idJob + AppConstants.FILES_URL;
    return this.http.get<FileRessource[]>(url,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  async getFiles(idJob: number): Promise<FileModel[]> {
    var fileRessArray: FileRessource[] = [];
    var fileArray: FileModel[] = [];

    await new Promise(resolve => {
      this.getFilesRessource(idJob).subscribe(resp => {
        fileRessArray = resp.body;

        for (let fileRess of fileRessArray) {
          var file = this.getFileFromRessource(fileRess);
          fileArray.push(file);
        }
        resolve();
      });
    });

    console.log(fileArray);
    return fileArray;
  }

  deleteFile(idFile: number): Observable<HttpResponse<Object>> {
    var url = `${AppConstants.JOB_BASE_URL}${AppConstants.FILES_URL}/${idFile}`;
    return this.http.delete(url, { observe: 'response' });
  }

  getCarImageryUrl(car: Car): Observable<string> {
      var url = AppConstants.CAR_IMAGERY_URL + car.model.make.title + ' ' + car.model.title + ' ' + car.year;
      return this.http.get<string>(url,
        { headers: new HttpHeaders(), responseType:'text' as 'json' });
    }

  getElement(response: string): string {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(response, "text/xml");
    var node = <HTMLElement> xmlDoc.childNodes[0];
    var url = node.innerHTML;
    return url;
  }

  async getCarImage(car: Car): Promise<SafeResourceUrl> {
    var carImgUrl: SafeResourceUrl;

    await new Promise(resolve => {
      this.getCarImageryUrl(car).subscribe(resp => {
        var url: string = this.getElement(resp);
        carImgUrl = this.getSafeUrl(url);
        resolve();
      });
    });

    return carImgUrl;
  }

  getSafeUrl(url): SafeResourceUrl {
    var fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return fileUrl;
  }

  getClientJobsRessource(idClient: number): Observable<HttpResponse<JobRessource[]>> {
    var url:string = `${AppConstants.JOB_BASE_URL}${AppConstants.CLIENTS_URL}/${idClient}`;
    return this.http.get<JobRessource[]>(url, { observe: 'response' });
  }

  async getClientJobs(idClient: number): Promise<Job[]> {
    var jobs: Job[] = [];

    await new Promise(resolve => {
      this.getClientJobsRessource(idClient).subscribe(resp => {
        for (let jobRess of resp.body) {
          jobs.push(this.getJobFromRessource(jobRess));
        }
        resolve();
      });
    });

    return jobs;
  }
}
