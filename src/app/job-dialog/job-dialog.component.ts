import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Job, JobTask, Status } from '../models/job';
import { JobService } from '../job.service';
import { TaskService } from '../task.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";

export interface DialogData {
  selectedJob: Job;
  tasks: JobTask[];
  statusArr: Promise<Status[]>;
}

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.css']
})
export class JobDialogComponent {

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private router: Router,
              private taskService: TaskService,
              public dialogRef: MatDialogRef<JobDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(selectedJob:Job, tasks:JobTask[]) {
    var observables = [];
    observables.push(this.jobService.updateJob(this.data.selectedJob));
    for (let task of this.data.tasks) {
      observables.push(this.taskService.updateTask(task));
    }

    forkJoin(observables).subscribe(results => {
      this.messageService.showSuccess(this.translate.instant('job.success'));
      this.dialogRef.close();
      this.router.navigate(['/job']);
    }, error => {
      this.messageService.showError(this.translate.instant('job.error'));
    });
  }

  getStatusFromEventOnChange(event: Event): Status {
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    let idStatusSelected:number = +selectedOptions[selectedIndex].attributes['ng-reflect-ng-value'].value;
    let statusSelected:string = selectedOptions[selectedIndex].text;

    let status:Status = {
      idStatus: idStatusSelected,
      status: statusSelected
    };
    return status;
  }

  setSelectedStatusTask(task:JobTask, event: Event) {
    task.status = this.getStatusFromEventOnChange(event);
  }

  setSelectedStatusJob(job:Job, event: Event) {
    job.status = this.getStatusFromEventOnChange(event);
  }
}
