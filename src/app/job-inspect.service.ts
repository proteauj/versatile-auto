import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Task, CarArea, CarSide } from './models/jobInspect';
import { TaskRessource, CarAreaRessource, CarSideRessource } from './ressources/jobInspectRessource';
import { Observable } from "rxjs";
import { AppConstants} from './app.constants';

@Injectable({
  providedIn: 'root'
})
export class JobInspectService {

  constructor() { }
}
