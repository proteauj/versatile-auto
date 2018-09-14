import { Component, OnInit } from '@angular/core';
import { Car } from '../models/car';
import { Job } from '../models/job';

@Component({
  selector: 'app-job-new',
  templateUrl: './job-new.component.html',
  styleUrls: ['./job-new.component.css']
})
export class JobNewComponent implements OnInit {
    validJob: Job;
    validCar: Car;

	job: Job = {
	    id: null,
      description: '',
      car: null
	};

	car: Car = {
	    id: null,
	    year: null,
	    make: '',
	    model: '',
	    vin: null
	};

	creationTried: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
