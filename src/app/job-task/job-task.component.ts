import { Component, OnInit } from '@angular/core';
import { Job, JobTask, Status } from '../models/job';
import { Employee, Role } from '../models/user';
import { JobService } from '../job.service';
import { TaskService } from '../task.service';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';
import { faPlusCircle, faEdit, faMinusCircle, faSave, faEraser, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-job-task',
  templateUrl: './job-task.component.html',
  styleUrls: ['./job-task.component.css']
})
export class JobTaskComponent implements OnInit {

  private categories: Promise<Role[]>;
  private employees: Promise<Employee[]>;
  private status: Promise<Status[]>;
  private tasks: Map<number, JobTask> = new Map<number, JobTask>();
  private submitted: boolean = false;
  private taskForm: FormGroup;
  private isValid: boolean = false;
  private job: Job;
  private idTask: number = null;
  private isCreate: boolean = true;
  private isModify: boolean = false;
  private isCategorySelected: boolean = false;
  private idJob: number;

  faPlusCircle = faPlusCircle;
  faEdit = faEdit;
  faMinusCircle = faMinusCircle;
  faSave = faSave;
  faEraser = faEraser;
  faArrowCircleRight = faArrowCircleRight;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private userService: UserService, private router: Router,
              private formBuilder: FormBuilder, private route: ActivatedRoute,
              private taskService: TaskService) { }

  // convenience getter for easy access to form fields
  get f() { return this.taskForm.controls; }

  ngOnInit() {
    this.categories = this.userService.getRoles();
    this.status = this.jobService.getStatus();

    this.route.params.subscribe(params => {
      this.idJob = params['idJob'];
      this.jobService.getJob(this.idJob).then(data => {
        this.job = data;

        this.taskService.getJobTasks(this.job.idJob).then(data => {
          var jobTasks = data;

          for (let task of jobTasks) {
            this.tasks.set(task.id, task);
          }
        });
      });
    });

    this.setTaskFormGroup(null);
  }

  setTaskFormGroup(task: JobTask) {
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
      time = task.estimatedTime;
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

  getTasksValues(): Array<JobTask> {
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

  getTaskFromTaskForm(): JobTask {
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

    var task: JobTask = {
      id: this.idTask,
      name: this.taskForm.controls.name.value,
      estimatedTime: this.taskForm.controls.time.value,
      job: this.job,
      status: status,
      priority: this.taskForm.controls.priority.value,
      role: category,
      user: assignation,
      task: null,
      elapsedTime: 0,
      carArea: null
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
    var task: JobTask = this.getTaskFromTaskForm();

    if (this.idTask != null) {
      this.taskService.updateTask(task).subscribe(data => {
        this.messageService.showSuccess(this.translate.instant('jobtask.update.success'));
      }, error => {
        this.messageService.showError(this.translate.instant('jobtask.update.error'));
      });
    } else {
      var tasks: JobTask[];
      tasks.push(task);
      this.taskService.createTask(tasks).subscribe(data => {
        var tasksCreated = data.body;
        this.tasks.set(tasksCreated[0].id, this.taskService.getJobTaskFromRessource(tasksCreated[0]));
        this.messageService.showSuccess(this.translate.instant('jobtask.create.success'));
      }, error => {
        this.messageService.showError(this.translate.instant('jobtask.create.error'));
      });
    }

    this.setTaskFormGroup(null);
    this.idTask = null;
  }

  onDelete(id: number) {
    this.taskService.deleteTask(id).subscribe(data => {
      this.messageService.showSuccess(this.translate.instant('jobtask.delete.success'));
      this.tasks.delete(id);
    }, error => {
      this.messageService.showError(this.translate.instant('jobtask.delete.error'));
    });
  }

  toUpdate(id: number) {
    this.idTask = id;
    var task: JobTask = this.tasks.get(id);
    this.setTaskFormGroup(task);
  }

  toJobDetails() {
    this.router.navigate(['/job-details', this.idJob]);
  }
}



