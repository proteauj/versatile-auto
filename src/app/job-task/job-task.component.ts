import { Component, OnInit } from '@angular/core';
import { Task } from '../models/job';
import { JobService } from '../job.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-task',
  templateUrl: './job-task.component.html',
  styleUrls: ['./job-task.component.css']
})
export class JobTaskComponent implements OnInit {
  tasks: Array<Task> = [
    { id: -1, name: 'Estimé', priority: 1, category: 'Admin', assignation: null, time: 30, status: 'IN_PROGRESS' },
    { id: -2, name: 'Débosser', priority: 2, category: 'Débosseur', assignation: null, time: 45, status: 'NEW' },
    { id: -3, name: 'Peinturer', priority: 3, category: 'Peintre', assignation: null, time:180, status: 'NEW' },
    { id: -4, name: 'Facture', priority: 4, category: 'Admin', assignation: null, time:15, status: 'NEW' }
  ]

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private router: Router) { }

  ngOnInit() {
  }
}



