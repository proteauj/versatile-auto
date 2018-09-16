import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
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

  getModels(make: Make): Observable<HttpResponse<ModelRessource>> {
    return this.http.get<ModelRessource>(`${this.BASE_URL}/${make.id}${this.urlModels}`, { observe: 'response' });
  }

  async getMakes(): Promise<Make[]> {
    var makeRessArray: MakeRessource[] = [];
    var makeArray: Make[] = [];

    await new Promise(resolve => {
      this.getMakesRessource().subscribe(resp => {
        makeRessArray = resp.body;

        for (let makeRess of makeRessArray) {
          var make: Make = {
            id: makeRess.id,
            code: makeRess.code,
            title: makeRess.title
          };

          makeArray.push(make);
        }
        resolve();
      });
    });

    return makeArray;
  }
}
