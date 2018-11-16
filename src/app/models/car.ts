import { SafeResourceUrl } from '@angular/platform-browser';

export class Car {
  id: number;
  year: number;
  vin: string;
  model: Model;
  imageUrl: SafeResourceUrl;
}

export class Make {
id: number;
  code: string;
  title: string;
}

export class Model {
  id: number;
  make: Make;
  code: string;
  title: string;
}

export class VinDecoded {
  year: number;
  make: string;
  model: string;
  trim: string;
  short_trim: string;
  body_type: string;
  vehicle_type: string;
  drivetrain: string;
  fuel_type: string;
  engine: string;
  engine_size: number;
  doors: number;
  cylinders: number;
  made_in: string;
}
