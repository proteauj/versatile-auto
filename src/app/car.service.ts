import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Car, Make, Model } from './models/car';
import { CarRessource, MakeRessource, ModelRessource } from './ressources/carRessource';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CarService implements OnInit {

  protected BASE_URL : string = 'http://localhost:8080/makes'
  protected urlModels : string = '/models';

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  getMakesRessource(): Observable<HttpResponse<MakeRessource[]>> {
    return this.http.get<MakeRessource[]>(`${this.BASE_URL}`, { observe: 'response' });
  }

  getModelsRessource(makeId: number): Observable<HttpResponse<ModelRessource[]>> {
    return this.http.get<ModelRessource[]>(`${this.BASE_URL}/${makeId}${this.urlModels}`, { observe: 'response' });
  }

  getCarFromRessource(carRess: CarRessource): Car {
    var car: Car = {
      id: carRess.id,
      year: carRess.year,
      vin: carRess.vin,
      model: this.getModelFromRessource(carRess.model)
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
}
