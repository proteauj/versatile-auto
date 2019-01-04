import { Component, OnInit } from '@angular/core';
import { Car, Make, Model, VinDecoded } from '../models/car';
import { Job, Status } from '../models/job';
import { Client } from '../models/client';
import { CarService } from '../car.service';
import { JobService } from '../job.service';
import { ClientService } from '../client.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-job-new',
  templateUrl: './job-new.component.html',
  styleUrls: ['./job-new.component.css']
})
export class JobNewComponent implements OnInit {
    private validJob: Job;
    private validCar: Car;
    public submitted: boolean = false;
    private isValid: boolean = false;
    public statusArr: Promise<Status[]>;
    private idJob: number;
    private jobToModify: Job;
    private isModify: boolean = false;
    private clients: Client[];

    public description;
    public vin;
    public status;
    public statusSel;
    public client;
    public clientSel;
    public arrivalDate;
    public toDeliverDate;
    public carForm: FormGroup;

	job: Job = {
	    idJob: null,
      description: '',
      car: null,
      status: null,
      client: null,
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

	creationTried: boolean = false;

  constructor(private carService: CarService, private messageService: MessageService,
              private translate: TranslateService, private jobService: JobService,
              private router: Router, private route: ActivatedRoute,
              private formBuilder: FormBuilder, private clientService: ClientService) { }

  ngOnInit() {
    this.setForm(null);

    const routeParams = this.route.snapshot.params;
    var paramIdJob = routeParams.idJob;

    if (paramIdJob) {
      this.idJob = paramIdJob;
      this.isModify = true;

      this.jobService.getJob(this.idJob).then(data => {
        this.jobToModify = data;
        this.setForm(this.jobToModify);
      });
    }

    this.statusArr = this.jobService.getStatus();

    this.clientService.getClients().then(data => {
      this.clients = data;
    });
  }

  setForm(job: Job) {
    var description: string = '';
    var year: number = null;
    var make: Make = null;
    var model: Model = null;
    var vin: string = '';
    var client: Client = null;
    var status: Status = null;
    var arrivalDate = new Date();
    var toDeliverDate = null;

    if (job != null) {
      description = job.description;
      vin = job.car.vin;
      this.car = job.car;
      client = job.client;
      status = job.status;

      if (job.arrivalDate != null) {
        arrivalDate = job.arrivalDate;
      }

      if (job.toDeliverDate != null) {
        toDeliverDate = job.toDeliverDate;
      }
    } else {
      //create state
      this.creationTried = false;
    }

    this.description = new FormControl(description, [Validators.required]);
    this.vin = new FormControl(vin, [Validators.required, Validators.pattern("[0-9A-Za-z]{17}")]);
    this.client = new FormControl(client, []);
    if (client != null) {
      this.clientSel = client;
    }
    this.status = new FormControl(status, [Validators.required]);
    if (status != null) {
      this.statusSel = status;
    }
    this.arrivalDate = new FormControl(arrivalDate, [Validators.required]);
    this.toDeliverDate = new FormControl(toDeliverDate, [Validators.required]);

    this.carForm = this.formBuilder.group({
      description: this.description,
      vin: this.vin,
      status: this.status,
      client: this.client,
      arrivalDate: this.arrivalDate,
      toDeliverDate: this.toDeliverDate
    });
  }

  compareStatus(s1: Status, s2: Status): boolean {
      return s1 && s2 ? s1.idStatus === s2.idStatus : s1 === s2;
  }

  compareClient(c1: Client, c2: Client): boolean {
    return c1 && c2 ? c1.idClient === c2.idClient : c1 === c2;
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

    var client: Client = {
      idClient: this.carForm.controls.client.value.idClient,
      name: this.carForm.controls.client.value.name,
      address: this.carForm.controls.client.value.address,
      telephone: this.carForm.controls.client.value.telephone,
      email: this.carForm.controls.client.value.email
    };

    this.job = {
      idJob: null,
      description: this.carForm.controls.description.value,
      car: this.carService.getCarRessourceFromModel(this.car),
      client: this.clientService.getClientRessourceFromModel(client),
      status: status,
      arrivalDate: this.carForm.controls.arrivalDate.value,
      toDeliverDate: this.carForm.controls.toDeliverDate.value,
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
      this.jobToModify.client = this.job.client;
      this.jobToModify.arrivalDate = this.job.arrivalDate;
      this.jobToModify.toDeliverDate = this.job.toDeliverDate;

      this.jobService.updateJob(this.jobToModify).subscribe(data => {
        console.log("PUT Job is successful ", data);
        this.messageService.showSuccess(this.translate.instant('jobnew.modify.success') + ' #' + data.body.idJob);
        this.router.navigate(['/job']);
      }, error => {
        this.messageService.showError(this.translate.instant('jobnew.modify.error'));
      });
    } else {
      this.jobService.createJob(this.job).subscribe(data => {
        console.log("POST Job is successful ", data);
        this.messageService.showSuccess(this.translate.instant('jobnew.create.success') + ' #' + data.body.idJob);
        this.router.navigate(['/job-inspect', data.body.idJob]);
      }, error => {
        this.messageService.showError(this.translate.instant('jobnew.create.error'));
      });
    }
  }

  getCarFromVin():void {
    var vin = this.vin.value;

    this.carService.getCarFromVin(vin).then(data => {
      this.car  = data;
    });
  }
}
