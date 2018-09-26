import { Component, OnInit } from '@angular/core';
import { Job, Task, Status } from '../models/job';
import { Employee, Role } from '../models/user';
import { JobService } from '../job.service';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';
import { faPlusCircle, faEdit, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-job-task',
  templateUrl: './job-task.component.html',
  styleUrls: ['./job-task.component.css']
})
export class JobTaskComponent implements OnInit {

  protected categories: Promise<Role[]>;
  protected employees: Promise<Employee[]>;
  protected status: Promise<Status[]>;
  protected tasks: Task[] = [];
  protected submitted: boolean = false;
  protected taskForm: FormGroup;
  protected isValid: boolean = false;
  protected job: Job;
  faPlusCircle = faPlusCircle;
  faEdit = faEdit;
  faMinusCircle = faMinusCircle;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private userService: UserService, private router: Router,
              private formBuilder: FormBuilder, private route: ActivatedRoute) { }

  // convenience getter for easy access to form fields
  get f() { return this.taskForm.controls; }

  ngOnInit() {
    this.categories = this.userService.getRoles();
    this.status = this.jobService.getStatus();
    this.route.params.subscribe(params => {
      var idJob: number = params['idJob'];
      this.jobService.getJob(idJob).then(data => this.job = data);
    });

    console.log(this.job);

//, Validators.max(this.tasks.length() + 1)

    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      priority: ['', [Validators.required, Validators.min(1)]],
      category: [null, [Validators.required]],
      assignation: [null, []],
      time: [null, [Validators.min(1)]],
      status: [null, [Validators.required]]
    });
  }

  onCategorySelect() {
    var category: Role = this.taskForm.controls.category.value;
    if (category != undefined) {
      this.employees = this.userService.getEmployeesByRole(category);
    }
  }

  onAdd(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.taskForm.invalid) {
      return;
    }

    var category: Role = {
      idRole: this.taskForm.controls.category.value.idRole,
      description: this.taskForm.controls.category.value.description
    }

    var assignation: Employee;
    if (this.taskForm.controls.assignation.value != undefined) {
      assignation = {
        idUser: this.taskForm.controls.assignation.value.idUser,
        name: this.taskForm.controls.assignation.value.name,
        role: this.taskForm.controls.assignation.value.role,
        type: this.taskForm.controls.assignation.value.type
      }
    }

    var status: Status = {
      idStatus: this.taskForm.controls.status.value.idStatus,
      status: this.taskForm.controls.status.value.status
    }

    var task: Task = {
      id: null,
      name: this.taskForm.controls.name.value,
      time: this.taskForm.controls.time.value,
      job: this.job,
      status: status,
      priority: this.taskForm.controls.priority.value,
      role: category,
      user: assignation
    }

    this.isValid = true;
    this.messageService.add(this.translate.instant('job-task.success'));

    this.tasks.push(task);
    console.log(this.tasks);

    /*this.jobService.createTask(task).subscribe(data => {
      console.log("POST Task is successful ", data);
    }, error => {
      console.log("Error", error);
    });*/
  }
}



