import { Injectable, OnInit, SecurityContext } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Client } from './models/client';
import { Job } from './models/job';
import { ClientRessource } from './ressources/clientRessource';
import { JobRessource } from './ressources/jobRessource';
import { Observable } from "rxjs";
import { AppConstants} from './app.constants';
import { JobService } from './job.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService implements OnInit {

  constructor(private http: HttpClient, private jobService: JobService) { }

  ngOnInit() { }

  getClientsRessource(): Observable<HttpResponse<ClientRessource[]>> {
    var url:string = `${AppConstants.CLIENTS_BASE_URL}`;
    return this.http.get<ClientRessource[]>(url, { observe: 'response' });
  }

  async getClients(): Promise<Client[]> {
    var clients: ClientRessource[] = [];

    await new Promise(resolve => {
      this.getClientsRessource().subscribe(resp => {
        for (let clientRess of resp.body) {
          clients.push(this.getClientFromRessource(clientRess));
        }
        resolve();
      });
    });

    return clients;
  }

  getClientRessourceFromModel(clientModel: Client): ClientRessource {
    var clientRess: ClientRessource = {
      idClient: clientModel.idClient,
      name: clientModel.name,
      address: clientModel.address,
      telephone: clientModel.telephone,
      email: clientModel.email
    };

    return clientRess;
  }

  getClientFromRessource(clientRess: ClientRessource): Client {
    var client: Client = {
      idClient: clientRess.idClient,
      name: clientRess.name,
      address: clientRess.address,
      telephone: clientRess.telephone,
      email: clientRess.email
    };

    return client;
  }

  getClientJobsRessource(idClient: number): Observable<HttpResponse<JobRessource[]>> {
    var url:string = `${AppConstants.JOB_BASE_URL}${AppConstants.CLIENTS_URL}/${idClient}`;
    return this.http.get<JobRessource[]>(url, { observe: 'response' });
  }

  async getClientJobs(idClient: number): Promise<Job[]> {
    var jobs: Job[] = [];

    await new Promise(resolve => {
      this.getClientJobsRessource(idClient).subscribe(resp => {
        for (let jobRess of resp.body) {
          jobs.push(this.jobService.getJobFromRessource(jobRess));
        }
        resolve();
      });
    });

    return jobs;
  }

  createClient(client: Client): Observable<HttpResponse<ClientRessource>> {
    var body = JSON.stringify(client);
    var url = AppConstants.CLIENTS_BASE_URL;
    return this.http.post<ClientRessource>(url, body,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  updateClient(client: Client): Observable<HttpResponse<ClientRessource>> {
     var body = JSON.stringify(client);
     var url = `${AppConstants.CLIENTS_BASE_URL}/${client.idClient}`;
     return this.http.put<ClientRessource>(url, body,
       { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }), observe: 'response' });
  }

  deleteClient(idClient: number): Observable<HttpResponse<Object>> {
    var url = `${AppConstants.CLIENTS_BASE_URL}/${idClient}`;
    return this.http.delete(url, { observe: 'response' });
  }
}
