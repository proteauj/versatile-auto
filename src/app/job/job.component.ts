import { Component, OnInit } from '@angular/core';
import { Job, Task } from '../models/job';
import { JobService } from '../job.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  protected jobs: Promise<Job[]>;
  protected tasksMap: Map<number, Task[]> = new Map<number, Task[]>();
  protected tasks: Task[] = [];
  protected selectedJob: Job;
  closeResult: string;
  protected statusArr: Promise<Status[]>;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.jobs = this.jobService.getJobs();

    this.jobs.then(data => {
      for (let job of data) {
        this.jobService.getJobTasks(job.idJob).then(data => {
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

  showSummary(job: Job, content) {
    this.selectedJob = job;
    this.tasks = [];
    for (let task of this.tasksMap.get(job.idJob)) {
      this.tasks.push(task);
    }

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => {
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
}
