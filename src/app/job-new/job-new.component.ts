import { Component, OnInit } from '@angular/core';
import { Car, Make, Model } from '../models/car';
import { Job, Status } from '../models/job';
import { CarService } from '../car.service';
import { JobService } from '../job.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-new',
  templateUrl: './job-new.component.html',
  styleUrls: ['./job-new.component.css']
})
export class JobNewComponent implements OnInit {
    validJob: Job;
    validCar: Car;
    makes: Promise<Make[]>;
    models: Promise<Model[]>;
    submitted: boolean = false;
    protected carForm: FormGroup;
    protected isValid: boolean = false;
    status: Promise<Status[]>;

	job: Job = {
	    id: null,
      description: '',
      car: null,
      status: null
	};

	car: Car = {
	    id: null,
	    year: null,
	    model: null,
	    vin: null
	};

	creationTried: boolean = false;

  constructor(private carService: CarService, private messageService: MessageService,
              private translate: TranslateService, private jobService: JobService,
              private router: Router, private formBuilder: FormBuilder) { }

  // convenience getter for easy access to form fields
  get f() { return this.carForm.controls; }

  ngOnInit() {
    this.makes = this.carService.getMakes();
    this.status = this.jobService.getStatus();

    this.carForm = this.formBuilder.group({
          description: ['', [Validators.required]],
          year: ['', [Validators.required, Validators.pattern("[0-9]{4}")]],
          make: [null, [Validators.required]],
          model: [null, [Validators.required]],
          vin: ['', []],
          status: [null, [Validators.required]]
        });
  }

  onMakeSelect() {
    var make: Make = this.carForm.controls.make.value;
    if (make != undefined) {
      this.models = this.carService.getModels(make);
    }
  }

  onCreate(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.carForm.invalid) {
      return;
    }

    var model: Model = {
      id: this.carForm.controls.model.value.id,
      make: this.carForm.controls.make.value,
      code: this.carForm.controls.model.value.code,
      title: this.carForm.controls.model.value.title
    }

    var car: Car = {
      id: null,
      year: this.carForm.controls.year.value,
      model: model,
      vin: this.carForm.controls.vin.value
    }

    var status: Status = {
      id: this.carForm.controls.status.value.id,
      status: this.carForm.controls.status.value.status
    }

    var job: Job = {
      id: null,
      description: this.carForm.controls.description.value,
      car: car,
      status: status
    }

    this.isValid = true;
    this.messageService.add(this.translate.instant('login.success'));
    console.log(job);

    this.jobService.createJob(job).subscribe(data => {
      console.log("POST Request is successful ", data);
    }, error => {
      console.log("Error", error);
    });
  }
}
