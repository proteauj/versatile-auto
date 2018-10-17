import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { DataTableModule } from "angular-6-datatable";

//import ngx-translate and http loader
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

//Versatile auto components
import { LoginComponent } from './login/login.component';

//Components
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { JobNewComponent } from './job-new/job-new.component';
import { MessagesComponent } from './messages/messages.component';
import { AppRoutingModule } from './/app-routing.module';
import { MenuComponent } from './menu/menu.component';
import { JobTaskComponent } from './job-task/job-task.component';
import { JobAttachmentComponent } from './job-attachment/job-attachment.component';

//File upload
import { AngularFileUploaderModule } from "angular-file-uploader";
import { JobDetailsComponent } from './job-details/job-details.component';

//ng-bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
//import { ToastModule } from 'angular-bootstrap-md';

//ToastModule
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        JobNewComponent,
        MessagesComponent,
        MenuComponent,
        JobTaskComponent,
        JobAttachmentComponent,
        JobDetailsComponent
    ],
    imports: [
        BrowserModule,
        FontAwesomeModule,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        DataTableModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        AngularFileUploaderModule,
        NgbModule,
        //ToastModule.forRoot(),
        MDBBootstrapModule.forRoot(),
        CommonModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot() // ToastrModule added
    ],
    schemas: [ NO_ERRORS_SCHEMA ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
