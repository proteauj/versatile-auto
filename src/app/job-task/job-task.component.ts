import { Component, OnInit } from '@angular/core';
import { Task, Status } from '../models/job';
import { Employee, Role } from '../models/user';
import { JobService } from '../job.service';
import { UserService } from '../user.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-task',
  templateUrl: './job-task.component.html',
  styleUrls: ['./job-task.component.css']
})
export class JobTaskComponent implements OnInit {

  protected categories: Promise<Role[]>;
  protected employees: Promise<Employee[]>;
  protected status: Promise<Status[]>;
  protected tasks: Task[];
  protected submitted: boolean = false;
  protected taskForm: FormGroup;
  protected isValid: boolean = false;

  constructor(private messageService: MessageService, private translate: TranslateService,
              private jobService: JobService, private userService: UserService, private router: Router,
              private formBuilder: FormBuilder) { }

  // convenience getter for easy access to form fields
  get f() { return this.taskForm.controls; }

  ngOnInit() {
    this.categories = this.userService.getRoles();
    this.status = this.jobService.getStatus();

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
      id: this.taskForm.controls.category.value.id,
      description: this.taskForm.controls.category.value.description
    }

    var assignation: Employee = {
      id: this.taskForm.controls.assignation.value.id,
      name: this.taskForm.controls.assignation.value.name,
      role: this.taskForm.controls.assignation.value.role,
      type: this.taskForm.controls.assignation.value.type
    }

    var status: Status = {
      id: this.taskForm.controls.status.value.id,
      status: this.taskForm.controls.status.value.status
    }

    var task: Task = {
      id: null,
      name: this.taskForm.controls.name.value,
      priority: this.taskForm.controls.priority.value,
      category: category,
      assignation: assignation,
      time: this.taskForm.controls.time.value,
      status: status
    }

    this.isValid = true;
    this.messageService.add(this.translate.instant('job-task.success'));
    console.log(task);

    this.tasks.push(task);
  }
}



