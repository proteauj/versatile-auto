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
import { faPlusCircle, faEdit, faMinusCircle, faSave, faEraser } from '@fortawesome/free-solid-svg-icons';

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
  protected isCreate: boolean = true;
  protected isModify: boolean = false;
  protected isCategorySelected: boolean = false;

  faPlusCircle = faPlusCircle;
  faEdit = faEdit;
  faMinusCircle = faMinusCircle;
  faSave = faSave;
  faEraser = faEraser;

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

          for (let task of jobTasks) {
            this.tasks.set(task.id, task);
          }
        });
      });
    });

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
      this.selectCategory(category);
      assignation = task.user;
      time = task.time;
      status = task.status;

      //modify state
      this.setButtonState(true);
    } else {
      //create state
      this.setButtonState(false);
      this.submitted = false;
      this.isCategorySelected = false;
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

  selectCategory(category: Role) {
    if (category != undefined) {
      this.employees = this.userService.getEmployeesByRole(category);
    }
    this.isCategorySelected = true;
  }

  onCategorySelect() {

    this.taskForm.controls['assignation'].setValue(null);
    var category: Role = this.taskForm.controls.category.value;
    this.selectCategory(category);
  }

  getTaskFromTaskForm(): Task {
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

    return task;
  }

  setButtonState(isModify: boolean) {
    this.isModify = isModify;
    this.isCreate = !isModify;
  }

  onErase(): void {
    this.setTaskFormGroup(null);
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.taskForm.invalid) {
      return;
    }

    this.isValid = true;
    var task: Task = this.getTaskFromTaskForm();

    if (this.idTask != null) {
      this.jobService.updateTask(task).subscribe(data => {
        this.messageService.add(this.translate.instant('jobtask.update.success'));
      }, error => {
        console.log("Error", error);
      });
    } else {
      this.jobService.createTask(task).subscribe(data => {
        this.messageService.add(this.translate.instant('jobtask.create.success'));
      }, error => {
        console.log("Error", error);
      });
    }

    this.tasks.set(task.id, task);
    this.setTaskFormGroup(null);
    this.idTask = null;
  }

  onDelete(id: number) {
    this.jobService.deleteTask(id).subscribe(data => {
      this.messageService.add(this.translate.instant('jobtask.delete.success'));
      this.tasks.delete(id);
    }, error => {
      console.log("Error", error);
    });
  }

  toUpdate(id: number) {
    this.idTask = id;
    var task: Task = this.tasks.get(id);
    this.setTaskFormGroup(task);
  }
}



