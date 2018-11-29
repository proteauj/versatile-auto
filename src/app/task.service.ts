import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Task } from './models/jobInspect';
import { TaskRessource } from './ressources/jobInspectRessource';
import { JobTask } from './models/job';
import { JobTaskRessource } from './ressources/jobRessource';
import { Observable } from "rxjs";
import { AppConstants} from './app.constants';
import { UserService } from './user.service'
import { JobService } from './job.service';
import { CarService } from './car.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient,
              private userService: UserService, private jobService: JobService,
              private carService: CarService) { }

  getTasksRessource(): Observable<HttpResponse<TaskRessource[]>> {
    return this.http.get<TaskRessource[]>(`${AppConstants.TASKS_URL}`, { observe: 'response' });
  }

  async getTasks(): Promise<Task[]> {
    var tasksRess: TaskRessource[] = [];
    var tasks: Task[] = [];

    await new Promise(resolve => {
      this.getTasksRessource().subscribe(resp => {
        tasksRess = resp.body;

        for (let taskRess of tasksRess) {
          var task: Task = this.getTaskFromRessource(taskRess);
          tasks.push(task);
        }
        resolve();
      });
    });

    console.log(tasks);
    return tasks;
  }

  getTaskFromRessource(taskRess: TaskRessource): Task {
    var task: Task = {
      idTask: taskRess.idTask,
      name: taskRess.name,
      avgTime: taskRess.avgTime,
      role: this.userService.getRoleFromRessource(taskRess.role),
      checked: false
    };

    return task;
  }

  getJobTaskFromRessource(taskRess: JobTaskRessource): JobTask {
    var task: JobTask = {
      id: taskRess.id,
      name: taskRess.name,
      estimatedTime: taskRess.estimatedTime,
      job: this.jobService.getJobFromRessource(taskRess.job),
      status: this.jobService.getStatusFromRessource(taskRess.status),
      user: null,
      priority: taskRess.priority,
      role: this.userService.getRoleFromRessource(taskRess.role),
      elapsedTime: taskRess.elapsedTime,
      task: null,
      carArea: null
    };

    if (taskRess.user != undefined) {
      task.user = this.userService.getEmployeeFromRessource(taskRess.user);
    }

    if (taskRess.task != undefined) {
      task.task = this.getTaskFromRessource(taskRess.task);
    }

    if (taskRess.carArea != undefined) {
      task.carArea = this.carService.getCarAreaFromRessource(taskRess.carArea);
    }

    return task;
  }

  getJobTasksRessource(idJob: number): Observable<HttpResponse<JobTaskRessource[]>> {
    return this.http.get<JobTaskRessource[]>(`${AppConstants.JOB_BASE_URL}/${idJob}${AppConstants.TASK_URL}`,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  async getJobTasks(idJob: number): Promise<JobTask[]> {
    var tasksRessArray: JobTaskRessource[] = [];
    var tasksArray: JobTask[] = [];

    await new Promise(resolve => {
      this.getJobTasksRessource(idJob).subscribe(resp => {
        tasksRessArray = resp.body;

        for (let taskRess of tasksRessArray) {
          var task: JobTask = this.getJobTaskFromRessource(taskRess);
          tasksArray.push(task);
        }
        resolve();
      });
    });

    console.log(tasksArray);
    return tasksArray;
  }

  updateTask(task: JobTask): Observable<HttpResponse<JobTaskRessource>> {
    var body = JSON.stringify(task);
    var url = `${AppConstants.JOB_BASE_URL}${AppConstants.TASK_URL}/${task.id}`;
    return this.http.put<JobTaskRessource>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  deleteTask(idTask: number): Observable<HttpResponse<Object>> {
    var url = `${AppConstants.JOB_BASE_URL}${AppConstants.TASK_URL}/${idTask}`;
    return this.http.delete(url, { observe: 'response' });
  }

  createTask(tasks: JobTask[]): Observable<HttpResponse<JobTaskRessource[]>> {
    var body = JSON.stringify(tasks);
    var url = `${AppConstants.JOB_BASE_URL}${AppConstants.TASK_URL}`;
    return this.http.post<JobTaskRessource[]>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }
}
