import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Car, Make, Model } from './models/car';
import { Job } from './models/job';
import { CarRessource, MakeRessource, ModelRessource, JobRessource } from './ressources/carRessource';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CarService implements OnInit {

  protected BASE_URL : string = 'http://localhost:8080/makes'
  protected JOB_BASE_URL : string = 'http://localhost:8080/jobs'
  protected urlModels : string = '/models';

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  getMakesRessource(): Observable<HttpResponse<MakeRessource[]>> {
    return this.http.get<MakeRessource[]>(`${this.BASE_URL}`, { observe: 'response' });
  }

  getModelsRessource(makeId: number): Observable<HttpResponse<ModelRessource[]>> {
    return this.http.get<ModelRessource[]>(`${this.BASE_URL}/${makeId}${this.urlModels}`, { observe: 'response' });
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


  async getModels(make: Make): Promise<Model[]> {
      var modelRessArray: ModelRessource[] = [];
      var modelArray: Model[] = [];

      await new Promise(resolve => {
        this.getModelsRessource(make.id).subscribe(resp => {
          modelRessArray = resp.body;

          for (let modelRess of modelRessArray) {
            var model: Model = {
              id: modelRess.id,
              code: modelRess.code,
              title: modelRess.title,
              make: make
            };

            modelArray.push(model);
          }
          resolve();
        });
      });

      return modelArray;
    }

    createJob(job: Job): Observable<HttpResponse<JobRessource>> {
      return this.http.post<JobRessource>(`${this.JOB_BASE_URL}`, JSON.stringify(job), { observe: 'response' });
    }
}
