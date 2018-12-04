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
              private taskService: TaskService) { }

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

    this.modalSummary = this.modalService.open(content);
    this.modalSummary.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onSubmit(selectedJob:Job, tasks:JobTask[]) {
    var observables = [];
    observables.push(this.jobService.updateJob(this.selectedJob));
    for (let task of tasks) {
      observables.push(this.taskService.updateTask(task));
    }

    forkJoin(observables).subscribe(results => {
      this.messageService.showSuccess(this.translate.instant('job.success'));
      this.modalSummary.close();
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
