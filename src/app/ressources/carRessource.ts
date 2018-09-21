export class CarRessource {
  id: number;
  year: number;
  vin: number;
  model: ModelRessource;
}

export class MakeRessource {
  id: number;
  code: string;
  title: string;
}

export class ModelRessource {
  id: number;
  make: MakeRessource;
  code: string;
  title: string;
}
