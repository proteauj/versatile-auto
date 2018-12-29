import { Component, OnInit } from '@angular/core';
import { Job, JobTask, Status } from '../models/job';
import { Employee, Role } from '../models/user';
import { JobTaskRessource } from '../ressources/jobRessource';
import { JobService } from '../job.service';
import { TaskService } from '../task.service';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';

@Component({
  selector: 'app-job-task',
  templateUrl: './job-task.component.html',
  styleUrls: ['./job-task.component.css']
})
export class JobTaskComponent implements OnInit {

  public categories: Promise<Role[]>;
  private employees: Employee[];
  private employeesByRole: Map<number, Employee[]> = new Map<number, Employee[]>();
  public statusArr: Promise<Status[]>;
  private tasks: Map<number, JobTask> = new Map<number, JobTask>();
  public submitted: boolean = false;
  private isValid: boolean = false;
  private job: Job;
  private idTask: number = null;
  public isCreate: boolean = true;
  public isModify: boolean = false;
  public isCategorySelected: boolean = false;
  private idJob: number;

  public name;
  public priority;
  public category;
  public assignation;
  public time;
  public status;
  public taskForm: FormGroup;

  displayedColumns = ['name', 'cararea', 'status', 'id'];
  dataSource;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private userService: UserService, private router: Router,
              private formBuilder: FormBuilder, private route: ActivatedRoute,
              private taskService: TaskService) { }

  // convenience getter for easy access to form fields
  get f() { return this.taskForm.controls; }

  ngOnInit() {
    this.categories = this.userService.getRoles();
    this.statusArr = this.jobService.getStatus();

    this.userService.getEmployees().then(data => {
      this.employees = data;
      this.setMapEmployeesByRole();
    });

    this.route.params.subscribe(params => {
      this.idJob = params['idJob'];
      this.jobService.getJob(this.idJob).then(data => {
        this.job = data;

        this.taskService.getJobTasks(this.job.idJob).then(data => {
          var jobTasks = data;

          for (let task of jobTasks) {
            this.tasks.set(task.id, task);
          }

          this.dataSource = this.getTasksValues();
        });
      });
    });

    this.setTaskFormGroup(null);
  }

  setMapEmployeesByRole() {
    for (let employee of this.employees) {
      for (let role of employee.roles) {
        if (this.employeesByRole.get(role.idRole) == null) {
          var employees: Employee[] = [];
          employees.push(employee);
          this.employeesByRole.set(role.idRole, employees);
        } else {
          this.employeesByRole.get(role.idRole).push(employee);
        }
      }
    }
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

    this.name = new FormControl(name, [Validators.required]);
    this.priority = new FormControl(priority, [Validators.required, Validators.min(1), Validators.pattern("[0-9]*")]);
    this.category = new FormControl(category, [Validators.required]);
    this.assignation = new FormControl(assignation, []);
    this.time = new FormControl(time, [Validators.required, Validators.min(1), Validators.pattern("[0-9]*")]);
    this.status = new FormControl(status, [Validators.required]);

    this.taskForm = this.formBuilder.group({
      name: this.name,
      priority: this.priority,
      category: this.category,
      assignation: this.assignation,
      time: this.time,
      status: this.status
    });
  }

  compareStatus(s1: Status, s2: Status): boolean {
    return s1 && s2 ? s1.idStatus === s2.idStatus : s1 === s2;
  }

  compareCategory(r1: Role, r2: Role): boolean {
    return r1 && r2 ? r1.idRole === r2.idRole : r1 === r2;
  }

  compareEmployee(e1: Employee, e2: Employee): boolean {
      return e1 && e2 ? e1.user.idUser === e2.user.idUser : e1 === e2;
    }

  getTasksValues(): Array<JobTask> {
      return Array.from(this.tasks.values());
  }

  selectCategory(category: Role) {
    if (category != undefined) {
      this.employees = this.employeesByRole.get(category.idRole);
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
      description: this.taskForm.controls.category.value.description,
      checked: false
    }

    var assignation: Employee;
    if (this.taskForm.controls.assignation.value != undefined) {
      assignation = {
        user: this.taskForm.controls.assignation.value.user,
        name: this.taskForm.controls.assignation.value.name,
        type: this.taskForm.controls.assignation.value.type,
        image: this.taskForm.controls.assignation.value.image,
        roles: this.taskForm.controls.assignation.value.roles
      }
    }

    var status: Status = {
      idStatus: this.taskForm.controls.status.value.idStatus,
      status: this.taskForm.controls.status.value.status
    }

    var jobTaskOriginal = this.tasks.get(this.idTask);

    var task: JobTask = {
      id: this.idTask,
      name: this.taskForm.controls.name.value,
      estimatedTime: this.taskForm.controls.time.value,
      job: this.job,
      status: status,
      priority: this.taskForm.controls.priority.value,
      role: category,
      user: assignation,
      task: jobTaskOriginal.task,
      elapsedTime: 0,
      carArea: jobTaskOriginal.carArea
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
        var taskModified = data.body;
        this.tasks.set(taskModified.id, this.taskService.getJobTaskFromRessource(taskModified));
        this.dataSource = this.getTasksValues();
        this.messageService.showSuccess(this.translate.instant('jobtask.update.success'));
      }, error => {
        this.messageService.showError(this.translate.instant('jobtask.update.error'));
      });
    } else {
      var tasks: JobTask[] = [];
      tasks.push(task);
      this.taskService.createTask(tasks).subscribe(data => {
        var tasksCreated = data.body;
        this.tasks.set(tasksCreated[0].id, this.taskService.getJobTaskFromRessource(tasksCreated[0]));
        this.dataSource = this.getTasksValues();
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
      this.dataSource = this.getTasksValues();
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



