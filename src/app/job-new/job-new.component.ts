import { Component, OnInit } from '@angular/core';
import { Car, Make, Model } from '../models/car';
import { Job } from '../models/job';
import { CarService } from '../car.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-new',
  templateUrl: './job-new.component.html',
  styleUrls: ['./job-new.component.css']
})
export class JobNewComponent implements OnInit {
    validJob: Job;
    validCar: Car;
    makes: Promise<Make[]>;

	job: Job = {
	    id: null,
      description: '',
      car: null
	};

	car: Car = {
	    id: null,
	    year: null,
	    model: null,
	    vin: null
	};

	creationTried: boolean = false;

  constructor(private carService: CarService, private messageService: MessageService,
                  private translate: TranslateService, private router: Router) { }

  ngOnInit() {
    this.makes = this.carService.getMakes();
    console.log(this.makes);
  }

}
