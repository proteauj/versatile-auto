import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Job, JobTask, Status } from '../models/job';
import { CarArea, Task } from '../models/jobInspect';
import { JobInspectService } from '../job-inspect.service';
import { TaskService } from '../task.service';
import { JobService } from '../job.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MaphilightModule } from 'ng-maphilight';

import { MatDialog, MatTableDataSource } from '@angular/material';
import { JobInspectDialogComponent } from '../job-inspect-dialog/job-inspect-dialog.component';

export interface DialogData {
  selectedCarArea: CarArea;
  tasks: Promise<Task[]>;
  jobTasks: JobTask[];
  job: Job;
  newStatus: Status;
  carAreas: Promise<CarArea[]>;
  jobTasksMap: Map<string, JobTask[]>;
}

@Component({
  selector: 'app-job-inspect',
  templateUrl: './job-inspect.component.html',
  styleUrls: ['./job-inspect.component.css']
})
export class JobInspectComponent implements OnInit {

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobInspectService: JobInspectService, private router: Router,
              private route: ActivatedRoute, private taskService: TaskService,
              private jobService: JobService, public dialog: MatDialog) { }

  private carAreas: Promise<CarArea[]>;
  private carAreasMap: Map<string, CarArea> = new Map<string, CarArea>();
  private tasks: Promise<Task[]>;
  public jobTasks: JobTask[];
  private jobTasksMap: Map<string, JobTask[]> = new Map<string, JobTask[]>();
  private newStatus: Status;
  private idJob: number;
  private job: Job;
  private selectedCarArea: CarArea;

  displayedColumns = ['carpart', 'name', 'time'];
  dataSource: MatTableDataSource<JobTask>;

  public config = {
     "fade": false,
     "alwaysOn": false,
     "neverOn": false,
     "fill": true,
     "fillColor": "#ff0000",
     "fillOpacity": 0.4,
     "stroke": true,
     "strokeColor": "#000000",
     "strokeOpacity": 1,
     "strokeWidth": 1,
     "shadow": false,
     "shadowColor": "#000000",
     "shadowOpacity": 0.8,
     "shadowRadius": 10
  };

  isPartSelected(partCode:string): string {
    if (this.jobTasksMap.get(partCode) != null) {
      return 'data-maphilight={"alwaysOn":true}';
    } else {
      return 'data-maphilight={"alwaysOn":false}';
    }
  }

  ngOnInit() {
    this.carAreas = this.jobInspectService.getCarAreas();
    this.tasks = this.taskService.getTasks();

    this.carAreas.then(data => {
      for (let carArea of data) {
        this.carAreasMap.set(carArea.code, carArea);
      }
    });

    this.route.params.subscribe(params => {
      this.idJob = params['idJob'];

      this.jobService.getJob(this.idJob).then(data => {
        this.job = data;
      });

      this.jobInspectService.getJobTasksWithCarArea(this.idJob).then(data => {
        this.jobTasks = data;
        this.dataSource = new MatTableDataSource<JobTask>(this.jobTasks);

        for (let jobTask of this.jobTasks) {
          var carAreaCode: string = jobTask.carArea.code;

          if (this.jobTasksMap.get(carAreaCode) == null) {
            this.jobTasksMap.set(carAreaCode, []);

            var element = document.getElementById(carAreaCode);
            element.setAttribute('data-maphilight', '{"alwaysOn":true}');
          }
          this.jobTasksMap.get(carAreaCode).push(jobTask);
        }
      });
    });

    this.jobService.getStatusStr('NEW').then(data => {
      this.newStatus = data;
    });
  }

  carPartSelected(event, content) {
    var carAreaCode = event.currentTarget.id;
    this.selectedCarArea = this.carAreasMap.get(carAreaCode);

    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(JobInspectDialogComponent, {
      data: {
        selectedCarArea: this.selectedCarArea,
        tasks: this.tasks,
        jobTasks: this.jobTasks,
        job: this.job,
        newStatus: this.newStatus,
        carAreas: this.carAreas,
        jobTasksMap: this.jobTasksMap
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.data = this.jobTasks;
      console.log('The dialog was closed');
    });
  }
}
