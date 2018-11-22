import { Component, OnInit } from '@angular/core';
import { Job, JobTask, Status } from '../models/job';
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
  protected carAreasMap: Map<string, CarArea> = new Map<string, CarArea>();
  protected tasks: Promise<Task[]>;
  protected jobTasks: JobTask[];
  protected idJob: number;
  protected job: Job;
  protected modalTask;
  protected closeResult: string;
  protected selectedCarArea: CarArea;

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


      this.jobInspectService.getJobTasksWithCarArea(this.idJob).then(data => {
        this.jobTasks = data;
      });
    });
  }

  carPartSelected(event, content) {
    var carAreaCode = event.currentTarget.id;
    this.selectedCarArea = this.carAreasMap.get(carAreaCode);

    var status: Status = null;

    var jobTask: JobTask = {
      id: -1,
      name: '',
      estimatedTime: 0,
      job: this.job,
      status: status,
      priority: 0,
      role: null,
      user: null,
      task: null,
      elapsedTime: 0,
      carArea: this.selectedCarArea
    }

    this.modalTask = this.modalService.open(content);
    this.modalTask.result.then((result) => {
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
