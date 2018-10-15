import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Job, Task, Status, FileModel } from './models/job';
import { JobRessource, JobTaskRessource, StatusRessource, FileRessource } from './ressources/jobRessource';
import { Observable } from "rxjs";
import { CarService } from './car.service';
import { UserService } from './user.service';
import { DomSanitizer } from '@angular/platform-browser';



@Injectable({
  providedIn: 'root'
})
export class JobService implements OnInit {

  protected JOB_BASE_URL : string = 'http://localhost:8080/jobs';
  protected TASK_URL : string = '/tasks';
  protected STATUS_BASE_URL : string = 'http://localhost:8080/status';
  protected FILES_URL: string = '/files';

  protected httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }),
    observe: 'response'
  };

  constructor(private http: HttpClient, private carService: CarService, private userService: UserService,
              private sanitizer: DomSanitizer) { }

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
      user: null,
      priority: taskRess.priority,
      role: this.userService.getRoleFromRessource(taskRess.role)
    };

    if (taskRess.user != undefined) {
      task.user = this.userService.getEmployeeFromRessource(taskRess.user);
    }

    return task;
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
      job: fileRess.job,
      url: null,
      isImage: fileRess.type.includes('image')
    }

    file.url = this.getUrl(this.base64ToArrayBuffer(file.file), file.type);

    return file;
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
    return this.http.get<JobTaskRessource[]>(`${this.JOB_BASE_URL}/${idJob}${this.TASK_URL}`,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
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
    return this.http.put<JobTaskRessource>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  deleteTask(idTask: number): Observable<HttpResponse<Object>> {
    var url = `${this.JOB_BASE_URL}${this.TASK_URL}/${idTask}`;
    return this.http.delete(url, { observe: 'response' });
  }

  getStatusRessource(): Observable<HttpResponse<StatusRessource[]>> {
    return this.http.get<StatusRessource[]>(`${this.STATUS_BASE_URL}`,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
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
    var url = this.JOB_BASE_URL;
    return this.http.post<JobRessource>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  createTask(task: Task): Observable<HttpResponse<JobTaskRessource>> {
    var body = JSON.stringify(task);
    var url = `${this.JOB_BASE_URL}${this.TASK_URL}`;
    return this.http.post<JobTaskRessource>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  createFiles(files: File[], idJob: number): Observable<HttpResponse<FileRessource[]>> {
    var url = this.JOB_BASE_URL + '/' + idJob + this.FILES_URL;

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
    var url = this.JOB_BASE_URL + '/' + idJob + this.FILES_URL;
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
      var url = `${this.JOB_BASE_URL}${this.FILES_URL}/${idFile}`;
      return this.http.delete(url, { observe: 'response' });
    }
}
