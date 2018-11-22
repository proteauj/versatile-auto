import { Component, OnInit } from '@angular/core';
import { Job, JobTask, Status } from '../models/job';
import { CarArea, Task } from '../models/jobInspect';
import { JobInspectService } from '../job-inspect.service';
import { TaskService } from '../task.service';
import { JobService } from '../job.service';
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
              private taskService: TaskService, private jobService: JobService) { }

  protected carAreas: Promise<CarArea[]>;
  protected carAreasMap: Map<string, CarArea> = new Map<string, CarArea>();
  protected tasks: Promise<Task[]>;
  protected jobTasks: JobTask[];
  protected newStatus: Status;
  protected idJob: number;
  protected job: Job;
  protected modalTask;
  protected closeResult: string;
  protected selectedCarArea: CarArea;
  protected selectedTasks: Task[];

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

    this.jobService.getStatusStr('NEW').then(data => {
      this.newStatus = data;
    });
  }

  carPartSelected(event, content) {
    var carAreaCode = event.currentTarget.id;
    this.selectedCarArea = this.carAreasMap.get(carAreaCode);

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

  onSubmit(selectedCarArea, selectedTasks) {
    for (let task of selectedTasks) {
      var jobTask: JobTask = {
        id: -1,
        name: task.name,
        estimatedTime: task.avgTime,
        job: this.job,
        status: this.newStatus,
        priority: 0,
        role: task.role,
        user: null,
        task: task,
        elapsedTime: 0,
        carArea: selectedCarArea
      }

      this.taskService.createTask(jobTask);
      this.jobTasks.push(jobTask);
    }
  }

  /*setSelectedCarArea(selectedCarArea:CarArea, $event) {
       let selectedOptions = event.target['options'];
       let selectedIndex = selectedOptions.selectedIndex;
       let carAreaTextSelected:string = selectedOptions[selectedIndex].text;

       selectedCarArea = this.carAreasMap.get(carAreaTextSelected);
     }*/
}
