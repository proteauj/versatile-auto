import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Task, CarArea, CarSide } from './models/jobInspect';
import { TaskRessource, CarAreaRessource, CarSideRessource } from './ressources/jobInspectRessource';
import { JobTask } from './models/job';
import { JobTaskRessource } from './ressources/jobRessource';
import { Observable } from "rxjs";
import { AppConstants} from './app.constants';
import { UserService } from './user.service'
import { TaskService } from './task.service';
import { CarService } from './car.service';

@Injectable({
  providedIn: 'root'
})
export class JobInspectService implements OnInit {

  constructor(private http: HttpClient, private userService: UserService, private taskService: TaskService,
              private carService: CarService) { }

  ngOnInit() { }

  getCarAreasRessource(): Observable<HttpResponse<CarAreaRessource[]>> {
    return this.http.get<CarAreaRessource[]>(`${AppConstants.CAR_AREAS_URL}`, { observe: 'response' });
  }

  getJobTasksRessourceWithCarArea(idJob: number): Observable<HttpResponse<JobTaskRessource[]>> {
    var url:string =
      `${AppConstants.JOB_BASE_URL}/${idJob}${AppConstants.TASK_URL}${AppConstants.CAR_AREA_ONLY_PARAM}true`;
    return this.http.get<JobTaskRessource[]>(url, { observe: 'response' });
  }

  async getCarAreas(): Promise<CarArea[]> {
    var carAreasRess: CarAreaRessource[] = [];
    var carAreas: CarArea[] = [];

    await new Promise(resolve => {
      this.getCarAreasRessource().subscribe(resp => {
        carAreasRess = resp.body;

        for (let carAreaRess of carAreasRess) {
          var carArea: CarArea = this.carService.getCarAreaFromRessource(carAreaRess);
          carAreas.push(carArea);
        }
        resolve();
      });
    });

    console.log(carAreas);
    return carAreas;
  }

  async getJobTasksWithCarArea(idJob: number): Promise<JobTask[]> {
    var tasksRessArray: JobTaskRessource[] = [];
    var tasksArray: JobTask[] = [];

    await new Promise(resolve => {
      this.getJobTasksRessourceWithCarArea(idJob).subscribe(resp => {
        tasksRessArray = resp.body;

        for (let taskRess of tasksRessArray) {
          var task: JobTask = this.taskService.getJobTaskFromRessource(taskRess);
          tasksArray.push(task);
        }
        resolve();
      });
    });

    console.log(tasksArray);
    return tasksArray;
  }
}
