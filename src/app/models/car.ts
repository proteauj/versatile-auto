export class Car {
  id: number;
  year: number;
  vin: string;
  model: Model;
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
