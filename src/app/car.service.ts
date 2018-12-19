import { Injectable, OnInit, SecurityContext } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Car, Make, Model, VinDecoded } from './models/car';
import { CarArea, CarSide } from './models/jobInspect';
import { CarRessource, MakeRessource, ModelRessource } from './ressources/carRessource';
import { CarAreaRessource, CarSideRessource } from './ressources/jobInspectRessource';
import { Observable } from "rxjs";
import { AppConstants} from './app.constants';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class CarService implements OnInit {

  protected httpOptions = {
    headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Host-Override': 'marketcheck-prod.apigee.net'
             }),
    observe: 'response' as 'response'
  };

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit() { }

  getCarFromVinRessource(vin:string): Observable<HttpResponse<CarRessource>> {
    var url:string = `${AppConstants.CAR_URL}${AppConstants.VIN_URL}/${vin}`;
    return this.http.get<CarRessource>(url, { observe: 'response' });
  }

  async getCarFromVin(vin:string): Promise<Car> {
      var car: CarRessource;

      await new Promise(resolve => {
        this.getCarFromVinRessource(vin).subscribe(resp => {
          car = resp.body;
          resolve();
        });
      });

      var carModel: Car = this.getCarFromRessource(car);
      carModel.imageUrl = this.getSafeUrl(car.imageUrl);

      return carModel;
    }

  getSafeUrl(url): SafeResourceUrl {
    var fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return fileUrl;
  }

  getMakesRessource(): Observable<HttpResponse<MakeRessource[]>> {
    return this.http.get<MakeRessource[]>(`${AppConstants.MAKES_URL}`, { observe: 'response' });
  }

  getModelsRessource(makeId: number): Observable<HttpResponse<ModelRessource[]>> {
    return this.http.get<ModelRessource[]>(`${AppConstants.MAKES_URL}/${makeId}${AppConstants.MODELS_URL}`, { observe: 'response' });
  }

  getCarRessourceFromModel(carModel: Car): CarRessource {
    var carRess: CarRessource = {
      id: carModel.id,
      year: carModel.year,
      vin: carModel.vin,
      model: carModel.model,
      imageUrl: this.sanitizer.sanitize(SecurityContext.URL, carModel.imageUrl)
    };

    return carRess;
  }

  getCarFromRessource(carRess: CarRessource): Car {
    var car: Car = {
      id: carRess.id,
      year: carRess.year,
      vin: carRess.vin,
      model: this.getModelFromRessource(carRess.model),
      imageUrl: carRess.imageUrl
    };

    return car;
  }

  getModelFromRessource(modelRess: ModelRessource): Model {
    var model: Model = {
      id: modelRess.id,
      code: modelRess.code,
      title: modelRess.title,
      make: this.getMakeFromRessource(modelRess.make)
    };

    return model;
  }

  getMakeFromRessource(makeRess: MakeRessource): Make {
    var make: Make = {
      id: makeRess.id,
      code: makeRess.code,
      title: makeRess.title
    };

    return make;
  }

  async getMakes(): Promise<Make[]> {
    var makeRessArray: MakeRessource[] = [];
    var makeArray: Make[] = [];

    await new Promise(resolve => {
      this.getMakesRessource().subscribe(resp => {
        makeRessArray = resp.body;

        for (let makeRess of makeRessArray) {
          var make = this.getMakeFromRessource(makeRess);
          makeArray.push(make);
        }
        resolve();
      });
    });

    return makeArray;
  }

  async getModels(make: Make): Promise<Model[]> {
      var modelRessArray: ModelRessource[] = [];
      var modelArray: Model[] = [];

      await new Promise(resolve => {
        this.getModelsRessource(make.id).subscribe(resp => {
          modelRessArray = resp.body;

          for (let modelRess of modelRessArray) {
            var model = this.getModelFromRessource(modelRess);
            modelArray.push(model);
          }
          resolve();
        });
      });

      return modelArray;
    }

    getCarAreaFromRessource(carAreaRess: CarAreaRessource): CarArea {
      var carArea: CarArea = {
        idCarArea: carAreaRess.idCarArea,
        code: carAreaRess.code,
        carSide: this.getCarSideFromRessource(carAreaRess.carSide)
      };

      return carArea;
    }

    getCarAreaRessourceFromModel(carArea: CarArea): CarAreaRessource {
      var carAreaRess: CarAreaRessource = {
        idCarArea: carArea.idCarArea,
        code: carArea.code,
        carSide: this.getCarSideRessourceFromModel(carArea.carSide)
      };

      return carAreaRess;
    }

    getCarSideFromRessource(carSideRess: CarSideRessource): CarSide {
      var carSide: CarSide = {
        idCarSide: carSideRess.idCarSide,
        name: carSideRess.name
      };

      return carSide;
    }

    getCarSideRessourceFromModel(carSide: CarSide): CarSideRessource {
      var carSideRess: CarSideRessource = {
        idCarSide: carSide.idCarSide,
        name: carSide.name
      };

      return carSideRess;
    }
}
