import { Component, OnInit } from '@angular/core';
import { Job } from '../models/job';
import { JobService } from '../job.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  protected jobs: Promise<Job[]>;
  protected images: Map<number, string> = new Map<number, string>();

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService) { }

  ngOnInit() {
    this.jobs = this.jobService.getJobs();
  }

  getCarImages() {
    for (let job of this.jobs) {

    }
  }
}
