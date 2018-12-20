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

  getJobTasksFromRessource(tasksRess: JobTaskRessource[]): JobTask[] {
    var tasks: JobTask[] = [];
    for (let taskRess of tasksRess) {
      tasks.push(this.getJobTaskFromRessource(taskRess));
    }
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

  getTaskRessourceFromModel(task: Task): TaskRessource {
    var taskRess: TaskRessource = {
      idTask: task.idTask,
      name: task.name,
      avgTime: task.avgTime,
      role: this.userService.getRoleRessourceFromRole(task.role)
    };

    return taskRess;
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
      task.task.checked = true;
    }

    if (taskRess.carArea != undefined) {
      task.carArea = this.carService.getCarAreaFromRessource(taskRess.carArea);
    }

    return task;
  }

  getJobTasksRessourceFromJobTasks(jobTasks: JobTask[]): JobTaskRessource[] {
    var jobTasksRess: JobTaskRessource[] = [];

    for (let jobTask of jobTasks) {
      jobTasksRess.push(this.getJobTaskRessourceFromJobTask(jobTask));
    }

    return jobTasksRess;
  }

  getJobTaskRessourceFromJobTask(jobTask: JobTask): JobTaskRessource {
    var jobTaskRess: JobTaskRessource = {
      id: jobTask.id,
      name: jobTask.name,
      estimatedTime: jobTask.estimatedTime,
      job: this.jobService.getJobRessourceFromModel(jobTask.job),
      status: this.jobService.getStatusRessourceFromModel(jobTask.status),
      user: null,
      priority: jobTask.priority,
      role: this.userService.getRoleRessourceFromRole(jobTask.role),
      elapsedTime: jobTask.elapsedTime,
      task: null,
      carArea: null
    };

    if (jobTask.user != null) {
      jobTaskRess.user = this.userService.getUserRessourceFromEmployee(jobTask.user);
    }

    if (jobTask.task != null) {
      jobTaskRess.task = this.getTaskRessourceFromModel(jobTask.task);
    }

    if (jobTask.carArea != null) {
      jobTaskRess.carArea = this.carService.getCarAreaRessourceFromModel(jobTask.carArea);
    }

    return jobTaskRess;
  }

  getUserTasksRessource(idUser: number): Observable<HttpResponse<JobTaskRessource[]>> {
    return this.http.get<JobTaskRessource[]>(`${AppConstants.USERS_URL}/${idUser}${AppConstants.TASK_URL}`,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  async getUserTasks(idUser: number): Promise<JobTask[]> {
    var tasksRessArray: JobTaskRessource[] = [];
    var tasksArray: JobTask[] = [];

    await new Promise(resolve => {
      this.getUserTasksRessource(idUser).subscribe(resp => {
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
    var taskRess: JobTaskRessource = this.getJobTaskRessourceFromJobTask(task);
    var body = JSON.stringify(taskRess);
    var url = `${AppConstants.JOB_BASE_URL}${AppConstants.TASK_URL}/${task.id}`;
    return this.http.put<JobTaskRessource>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  deleteTask(idTask: number): Observable<HttpResponse<Object>> {
    var url = `${AppConstants.JOB_BASE_URL}${AppConstants.TASK_URL}/${idTask}`;
    return this.http.delete(url, { observe: 'response' });
  }

  createTask(tasks: JobTask[]): Observable<HttpResponse<JobTaskRessource[]>> {
    var tasksRess: JobTaskRessource[] = this.getJobTasksRessourceFromJobTasks(tasks);
    var body = JSON.stringify(tasksRess);
    var url = `${AppConstants.JOB_BASE_URL}${AppConstants.TASK_URL}`;
    return this.http.post<JobTaskRessource[]>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }
}
