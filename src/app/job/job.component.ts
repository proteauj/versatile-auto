import { Component, OnInit } from '@angular/core';
import { Job } from '../models/job';
import { JobService } from '../job.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  protected jobs: Promise<Job[]>;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private router: Router) { }

  ngOnInit() {
    this.jobs = this.jobService.getJobs();
  }

  showJob(job: Job) {
    this.router.navigate(['/job-new', job.idJob]);
  }
}
