import { Component, OnInit } from '@angular/core';
import { JobTask } from '../models/job';
import { CarArea, Task } from '../models/jobInspect';
import { JobInspectService } from '../job-inspect.service';
import { TaskService } from '../task.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-job-inspect',
  templateUrl: './job-inspect.component.html',
  styleUrls: ['./job-inspect.component.css']
})
export class JobInspectComponent implements OnInit {

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobInspectService: JobInspectService, private router: Router,
              private modalService: NgbModal, private route: ActivatedRoute,
              private taskService: TaskService) { }

  protected carAreas: Promise<CarArea[]>;
  protected tasks: Promise<Task[]>;
  protected jobTasks: JobTask[];
  protected idJob: number;

  ngOnInit() {
    this.carAreas = this.jobInspectService.getCarAreas();
    this.tasks = this.taskService.getTasks();

    this.route.params.subscribe(params => {
      this.idJob = params['idJob'];

      this.jobInspectService.getJobTasksWithCarArea(this.idJob).then(data => {
        this.jobTasks = data;
      });
    });
  }

}
