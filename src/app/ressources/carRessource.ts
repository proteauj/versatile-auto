export class CarRessource {
  id: number;
  year: number;
  vin: string;
  model: ModelRessource;
  imageUrl: string;
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
