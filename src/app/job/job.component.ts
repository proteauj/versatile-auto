import { Component, OnInit } from '@angular/core';
import { Job, JobTask, Status } from '../models/job';
import { JobService } from '../job.service';
import { TaskService } from '../task.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";

import { MatDialog } from '@angular/material';
import { JobDialogComponent } from '../job-dialog/job-dialog.component';

export interface DialogData {
  selectedJob: Job;
  tasks: JobTask[];
  statusArr: Promise<Status[]>;
}

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  public jobs: Promise<Job[]>;
  private tasksMap: Map<number, JobTask[]> = new Map<number, JobTask[]>();
  private tasks: JobTask[] = [];
  private selectedJob: Job;
  private closeResult: string;
  private statusArr: Promise<Status[]>;
  private modalSummary;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private router: Router, private modalService: NgbModal,
              private taskService: TaskService, public dialog: MatDialog) { }

  ngOnInit() {
    this.jobs = this.jobService.getJobs();

    this.jobs.then(data => {
      for (let job of data) {
        this.taskService.getJobTasks(job.idJob).then(data => {
          var jobTasks = data;
          this.tasksMap.set(job.idJob, jobTasks);
        });
      }
    });

    this.statusArr = this.jobService.getStatus();
  }

  showJob(job: Job) {
    this.router.navigate(['/job-new', job.idJob]);
  }

  showTask(job: Job) {
    this.router.navigate(['/job-task', job.idJob]);
  }

  showDetails(job: Job) {
    this.router.navigate(['/job-details', job.idJob]);
  }

  showInspect(job: Job) {
    this.router.navigate(['/job-inspect', job.idJob]);
  }

  showSummary(job: Job, content) {
    this.selectedJob = job;
    this.tasks = [];
    for (let task of this.tasksMap.get(job.idJob)) {
      this.tasks.push(task);
    }

    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(JobDialogComponent, {
      data: {
        selectedJob: this.selectedJob,
        tasks: this.tasks,
        statusArr: this.statusArr
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
