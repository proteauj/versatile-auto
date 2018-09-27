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
  protected tasks: Map<number, Task> = new Map<number, Task>();
  protected submitted: boolean = false;
  protected taskForm: FormGroup;
  protected isValid: boolean = false;
  protected job: Job;
  protected idTask: number = null;

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
      this.jobService.getJob(idJob).then(data => {
        this.job = data;

        let jobTasks = this.jobService.getJobTasks(this.job.idJob);
        for (let task of jobTasks) {
          this.tasks.set(task.id, task);
        }
      });
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

  onSubmit(): void {
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
      id: this.idTask,
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

    console.log(this.tasks);

    if (this.idTask != null) {
      this.jobService.updateTask(task).subscribe(data => {
        console.log("PUT Task is successful ", data);
      }, error => {
        console.log("Error", error);
      });
    } else {
      this.jobService.createTask(task).subscribe(data => {
        console.log("POST Task is successful ", data);
      }, error => {
        console.log("Error", error);
      });
    }

    this.tasks.set(task.id, task);
    this.idTask = null;
  }

  onDelete(id: number) {
    this.jobService.deleteJobTask(id);
    this.tasks.delete(task.id);
  }

  toUpdate(id: number) {
    this.idTask = id;
    var task: Task = this.tasks.get(id);

    this.taskForm.controls.category.value.idRole = task.role.idRole;
    this.taskForm.controls.category.value.description = task.role.description;

    if (task.user != null) {
      this.taskForm.controls.assignation.value.idUser = task.user.idUser;
      this.taskForm.controls.assignation.value.name = task.user.name;
      this.taskForm.controls.assignation.value.role = task.user.role;
      this.taskForm.controls.assignation.value.type = task.user.type;
    }

    this.taskForm.controls.status.value.idStatus = task.status.idStatus;
    this.taskForm.controls.status.value.status = task.status.status;

    this.taskForm.controls.name.value = task.name;
    this.taskForm.controls.time.value = task.time;
    this.taskForm.controls.priority.value = task.priority;
  }
}



