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

        this.jobService.getJobTasks(this.job.idJob).then(data => {
          var jobTasks = data;
          console.log(jobTasks);
          for (let task of jobTasks) {
            this.tasks.set(task.id, task);
          }
          console.log(this.tasks);
        });
      });
    });

    console.log(this.job);
    console.log(this.tasks);


//, Validators.max(this.tasks.length() + 1)

    this.setTaskFormGroup(null);
  }

  setTaskFormGroup(task: Task) {
    var name: string = '';
    var priority: number = null;
    var category: Role = null;
    var assignation: Employee = null;
    var time: number = null;
    var status: Status = null;

    if (task != null) {
      name = task.name;
      priority = task.priority;
      category = task.role;
      assignation = task.user;
      time = task.time;
      status = task.status;
    }

    this.taskForm = this.formBuilder.group({
      name: [name, [Validators.required]],
      priority: [priority, [Validators.required, Validators.min(1)]],
      category: [category, [Validators.required]],
      assignation: [assignation, []],
      time: [time, [Validators.min(1)]],
      status: [status, [Validators.required]]
    });
  }

  getTasksValues(): Array<Task> {
      return Array.from(this.tasks.values());
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
    this.jobService.deleteTask(id).subscribe(data => {
      console.log("DELETE Task is successful ", data);
      this.tasks.delete(id);
    }, error => {
      console.log("Error", error);
    });
  }

  toUpdate(id: number) {
    this.idTask = id;
    var task: Task = this.tasks.get(id);
    this.setTaskFormGroup(task);

    /*this.taskForm.controls.category.value.idRole = task.role.idRole;
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
    this.taskForm.controls.priority.value = task.priority;*/
  }
}



