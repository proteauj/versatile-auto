import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Job, JobTask, Status } from '../models/job';
import { CarArea, Task } from '../models/jobInspect';
import { TaskService } from '../task.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";

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
  selector: 'app-job-inspect-dialog',
  templateUrl: './job-inspect-dialog.component.html',
  styleUrls: ['./job-inspect-dialog.component.css']
})
export class JobInspectDialogComponent implements OnInit {

  constructor(private messageService: MessageService, private translate: TranslateService,
              private taskService: TaskService, public dialogRef: MatDialogRef<JobInspectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData, private router: Router) { }

  isModify = false;
  isCreate = true;
  jobTasksWithoutCarAreaSel: JobTask[] = [];
  jobTasksCarAreaSel: JobTask[] = [];
  jobTasksCarAreaSelByTaskId: Map<number, JobTask> = new Map<number, JobTask>();

  ngOnInit() {
    this.jobTasksWithoutCarAreaSel = this.data.jobTasks.filter(jobTask => jobTask.carArea.code != this.data.selectedCarArea.code);
    this.jobTasksCarAreaSel = this.data.jobTasks.filter(jobTask => jobTask.carArea.code === this.data.selectedCarArea.code);

    for (let jobTask of this.jobTasksCarAreaSel) {
      this.jobTasksCarAreaSelByTaskId.set(jobTask.task.idTask, jobTask);
    }

    if (this.jobTasksCarAreaSel.length > 0) {
      this.isModify = true;
      this.isCreate = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getSelectedTasks(tasks: Task[]) {
    return tasks.filter(task => task.checked);
  }

  getSelectedJobTasks(jobTasksMap: Map<number, JobTask>) {
    var jobTasks: JobTask[] = Array.from(jobTasksMap.values());
    var jobTasksSel = jobTasks.filter(jobTask => jobTask.task.checked);
    var tasksSel = jobTasksSel.map(jobTask => jobTask.task);
    return tasksSel;
  }

  getJobTasksFromTasks(selectedTasks: Task[]) {
    var newJobTasks: JobTask[] = [];
    for (let task of selectedTasks) {
      var jobTask: JobTask = {
        id: -1,
        name: task.name,
        estimatedTime: task.avgTime,
        job: this.data.job,
        status: this.data.newStatus,
        priority: 1,
        role: task.role,
        user: null,
        task: task,
        elapsedTime: 0,
        carArea: this.data.selectedCarArea
      }

      newJobTasks.push(jobTask);
    }
    return newJobTasks;
  }

  createSelectedTasks(selectedTasks) {
    var newJobTasks = this.getJobTasksFromTasks(selectedTasks);

    this.taskService.createTask(newJobTasks).subscribe(data => {
      var newTaskWithId = this.taskService.getJobTasksFromRessource(data.body);
      this.data.jobTasks = this.data.jobTasks.concat(newTaskWithId);
      this.messageService.showSuccess(this.translate.instant('jobinspect.create.success'));
    }, error => {
      this.messageService.showError(this.translate.instant('jobinspect.create.error'));
    });
  }

  modifySelectedTasks(selectedTasks) {
    var selectedTaskId: Array<number> = selectedTasks.map(task => task.idTask);

    var jobTasksToModify: JobTask[] = [];
    var jobTasksToDelete: JobTask[] = [];

    //TODO : jobTasksCarAreaSelByTaskId car c'est lui qui est utilisé pour faire le checked
    for (let jobTask of this.jobTasksCarAreaSel) {
      var idTask = jobTask.task.idTask;

      if (selectedTaskId.filter(id => id == idTask).length > 0) {
        selectedTaskId = selectedTaskId.filter(id => id != idTask);
        jobTasksToModify.push(jobTask);
      } else {
        selectedTaskId = selectedTaskId.filter(id => id != idTask);
        jobTasksToDelete.push(jobTask);
      }
    }

    var tasksToCreate: Task[] = selectedTasks.filter(task => selectedTaskId.includes(task.idTask));
    var jobTasksToCreate = this.getJobTasksFromTasks(tasksToCreate);

    var observables = [];
    for (let taskToModify of jobTasksToModify) {
      observables.push(this.taskService.updateTask(taskToModify));
    }

    for (let taskToDelete of jobTasksToDelete) {
      observables.push(this.taskService.deleteTask(taskToDelete.id));
    }

    if (jobTasksToCreate.length > 0) {
      observables.push(this.taskService.createTask(jobTasksToCreate));
    }

    forkJoin(observables).subscribe(results => {
      this.messageService.showSuccess(this.translate.instant('jobinspect.create.success'));

      //this.router.navigate(['/job-inspect', this.data.job.idJob]);
 //      this.dialogRef.close();
    }, error => {
      this.messageService.showError(this.translate.instant('jobinspect.create.error'));
    });



  }

  onSubmit(selectedCarArea, tasks) {
    this.data.tasks.then(data => {
      var selectedTasks = this.getSelectedTasks(data).concat(this.getSelectedJobTasks(this.jobTasksCarAreaSelByTaskId));

      if (this.isCreate) {
        this.createSelectedTasks(selectedTasks);
      } else {
        this.modifySelectedTasks(selectedTasks);
      }

      this.dialogRef.close('test');
    });
  }
}
