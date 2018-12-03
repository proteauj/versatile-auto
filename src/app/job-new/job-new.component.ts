import { Component, OnInit } from '@angular/core';
import { Car, Make, Model, VinDecoded } from '../models/car';
import { Job, Status } from '../models/job';
import { CarService } from '../car.service';
import { JobService } from '../job.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-job-new',
  templateUrl: './job-new.component.html',
  styleUrls: ['./job-new.component.css']
})
export class JobNewComponent implements OnInit {
    private validJob: Job;
    private validCar: Car;
    public submitted: boolean = false;
    public carForm: FormGroup;
    private isValid: boolean = false;
    public status: Promise<Status[]>;
    private idJob: number;
    private jobToModify: Job;
    private isModify: boolean = false;
    faCalendarAlt = faCalendarAlt;

	job: Job = {
	    idJob: null,
      description: '',
      car: null,
      status: null,
      arrivalDate: null,
      toDeliverDate: null,
      carUrl: ''
	};

	car: Car = {
	    id: null,
	    year: null,
	    model: null,
	    vin: null,
	    imageUrl: null
	};

  getTodayDate() {
    return this.calendar.getToday();
  }

	creationTried: boolean = false;

  constructor(private carService: CarService, private messageService: MessageService,
              private translate: TranslateService, private jobService: JobService,
              private router: Router, private formBuilder: FormBuilder,
              private calendar: NgbCalendar, private route: ActivatedRoute) { }

  // convenience getter for easy access to form fields
  get f() { return this.carForm.controls; }

  ngOnInit() {
    this.setCarFormGroup(null);

    const routeParams = this.route.snapshot.params;
    var paramIdJob = routeParams.idJob;

    if (paramIdJob) {
      this.idJob = paramIdJob;
      this.isModify = true;

      this.jobService.getJob(this.idJob).then(data => {
        this.jobToModify = data;
        this.setCarFormGroup(this.jobToModify);
      });
    }

    this.status = this.jobService.getStatus();
  }

  setCarFormGroup(job: Job) {
    var description: string = '';
    var year: number = null;
    var make: Make = null;
    var model: Model = null;
    var vin: string = '';
    var status: Status = null;
    var arrivalDate: NgbDateStruct = this.getTodayDate();
    var toDeliverDate: NgbDateStruct = null;

    if (job != null) {
      description = job.description;
      vin = job.car.vin;
      this.car = job.car;
      status = job.status;

      if (job.arrivalDate != null) {
        arrivalDate = {
          year: job.arrivalDate.getFullYear(),
          month: job.arrivalDate.getMonth() + 1,
          day: job.arrivalDate.getDate()
        };
      }

      if (job.toDeliverDate != null) {
        toDeliverDate = {
          year: job.toDeliverDate.getFullYear(),
          month: job.toDeliverDate.getMonth() + 1,
          day: job.toDeliverDate.getDate()
        };
      }
    } else {
      //create state
      this.creationTried = false;
    }

    this.carForm = this.formBuilder.group({
      description: [description, [Validators.required]],
      vin: [vin, [Validators.required, Validators.pattern("[0-9A-Z]{17}")]],
      status: [status, [Validators.required]],
      arrivalDate: [arrivalDate, [Validators.required]],
      toDeliverDate: [toDeliverDate, [Validators.required]]
    });
  }

  getDateFromNgbDate(ngbDate: NgbDate): Date {
    return new Date(ngbDate.year, ngbDate.month -1, ngbDate.day);
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.carForm.invalid) {
      return;
    }

    var status: Status = {
      idStatus: this.carForm.controls.status.value.idStatus,
      status: this.carForm.controls.status.value.status
    };

    this.job = {
      idJob: null,
      description: this.carForm.controls.description.value,
      car: this.carService.getCarRessourceFromModel(this.car),
      status: status,
      arrivalDate: this.getDateFromNgbDate(this.carForm.controls.arrivalDate.value),
      toDeliverDate: this.getDateFromNgbDate(this.carForm.controls.toDeliverDate.value),
      carUrl: ''
    };

    this.isValid = true;
    console.log(this.job);

    if (this.isModify) {
      this.jobToModify.description = this.job.description;
      this.jobToModify.car.year = this.job.car.year;
      this.jobToModify.car.model = this.job.car.model;
      this.jobToModify.car.vin = this.job.car.vin;
      this.jobToModify.status = this.job.status;
      this.jobToModify.arrivalDate = this.job.arrivalDate;
      this.jobToModify.toDeliverDate = this.job.toDeliverDate;

      this.jobService.updateJob(this.jobToModify).subscribe(data => {
        console.log("PUT Job is successful ", data);
        this.messageService.showSuccess(this.translate.instant('jobnew.success'));
        this.router.navigate(['/job']);
      }, error => {
        this.messageService.showError(this.translate.instant('jobnew.error'));
      });
    } else {
      this.jobService.createJob(this.job).subscribe(data => {
        console.log("POST Job is successful ", data);
        this.messageService.showSuccess(this.translate.instant('jobnew.success'));
        this.router.navigate(['/job-task', data.body.idJob]);
      }, error => {
        this.messageService.showError(this.translate.instant('jobnew.error'));
      });
    }
  }

  getCarFromVin():void {
    var vin = this.carForm.controls.vin.value;

    this.carService.getCarFromVin(vin).then(data => {
      this.car  = data;
    });
  }
}
