import { Component, OnInit } from '@angular/core';
import { Client } from '../models/client';
import { ClientRessource } from '../ressources/clientRessource';
import { ClientService } from '../client.service';
import { MessageService } from '../message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DataTableModule } from 'angular-6-datatable';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
   public clients: Promise<Client[]>;
   private clientsMap: Map<number, Client> = new Map<number, Client>();
   public submitted: boolean = false;
   private isValid: boolean = false;
   public isCreate: boolean = true;
   public isModify: boolean = false;
   public idClient: number;

   public name;
   public address;
   public telephone;
   public email;
   public clientForm: FormGroup;

   displayedColumns = ['name', 'telephone'];
   dataSource;

   constructor(private messageService: MessageService, private translate: TranslateService,
               private clientService: ClientService, private router: Router,
               private formBuilder: FormBuilder, private route: ActivatedRoute) { }

   // convenience getter for easy access to form fields
   get f() { return this.clientForm.controls; }

   ngOnInit() {
     this.clients = this.clientService.getClients();
     this.clients.then(data => {
       for (let client of data) {
        this.clientsMap.set(client.idClient, client);
       }

       this.dataSource = this.getClientsValues();
     });

     this.setClientFormGroup(null);
   }

   setClientFormGroup(client: Client) {
     var name: string = '';
     var address: string = '';
     var telephone: string = '';
     var email: string = '';

     if (client != null) {
       name = client.name;
       address = client.address;
       telephone = client.telephone;
       email = client.email;

       //modify state
       this.setButtonState(true);
     } else {
       //create state
       this.setButtonState(false);
       this.submitted = false;
     }

     this.name = new FormControl(name, [Validators.required]);
     this.address = new FormControl(address, []);
     this.telephone = new FormControl(telephone, [Validators.pattern("[0-9]{10}")]);
     this.email = new FormControl(email, [Validators.email]);

     this.clientForm = this.formBuilder.group({
       name: this.name,
       address: this.address,
       telephone: this.telephone,
       email: this.email
     });
   }

   getClientFromClientForm(): Client {
     var client: Client = {
       idClient: this.idClient,
       name: this.clientForm.controls.name.value,
       address: this.clientForm.controls.address.value,
       telephone: this.clientForm.controls.telephone.value,
       email: this.clientForm.controls.email.value
     }

     return client;
   }

   getClientsValues(): Array<Client> {
     return Array.from(this.clientsMap.values());
   }

   setButtonState(isModify: boolean) {
     this.isModify = isModify;
     this.isCreate = !isModify;
   }

   onErase(): void {
     this.setClientFormGroup(null);
   }

   onSubmit(): void {
     this.submitted = true;

     // stop here if form is invalid
     if (this.clientForm.invalid) {
       return;
     }

     this.isValid = true;
     var client: Client = this.getClientFromClientForm();

     if (this.idClient != null) {
       this.clientService.updateClient(client).subscribe(data => {
         var clientModified = data.body;
         this.clientsMap.set(clientModified.idClient, this.clientService.getClientFromRessource(clientModified));
         this.dataSource = this.getClientsValues();
         this.messageService.showSuccess(this.translate.instant('client.update.success'));
       }, error => {
         this.messageService.showError(this.translate.instant('client.update.error'));
       });
     } else {
       this.clientService.createClient(client).subscribe(data => {
         var clientCreated = data.body;
         this.clientsMap.set(clientCreated.idClient, this.clientService.getClientFromRessource(clientCreated));
         this.dataSource = this.getClientsValues();
         this.messageService.showSuccess(this.translate.instant('client.create.success'));
       }, error => {
         this.messageService.showError(this.translate.instant('client.create.error'));
       });
     }

     this.setClientFormGroup(null);
     this.idClient = null;
   }

   onDelete(id: number) {
     this.clientService.deleteClient(id).subscribe(data => {
       this.messageService.showSuccess(this.translate.instant('client.delete.success'));
       this.clientsMap.delete(id);
       this.dataSource = this.getClientsValues();
     }, error => {
       this.messageService.showError(this.translate.instant('client.delete.error'));
     });
   }

   toUpdate(id: number) {
     this.idClient = id;
     var client: Client = this.clientsMap.get(id);
     this.setClientFormGroup(client);
   }
 }

