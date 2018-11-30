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

//Forms
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

//File upload
import { AngularFileUploaderModule } from "angular-file-uploader";

//DatePicker
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//ToastModule
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

//Components
import { LoginComponent } from './login/login.component';
import { JobNewComponent } from './job-new/job-new.component';
import { AppRoutingModule } from './/app-routing.module';
import { MenuComponent } from './menu/menu.component';
import { JobTaskComponent } from './job-task/job-task.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { JobComponent } from './job/job.component';
import { AppMaterialModule } from './material.module';
import { JobInspectComponent } from './job-inspect/job-inspect.component';

import { MaphilightModule } from 'ng-maphilight';
import { MatSliderModule } from '@angular/material/slider';
import 'hammerjs'
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { LocationStrategy, HashLocationStrategy} from '@angular/common';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        JobNewComponent,
        MenuComponent,
        JobTaskComponent,
        JobDetailsComponent,
        JobComponent,
        JobInspectComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
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
        NgbModule,
        MDBBootstrapModule.forRoot(),
        CommonModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot(), // ToastrModule added
        AppMaterialModule,
        MaphilightModule,
        MatSliderModule,
        AngularFireModule.initializeApp(environment.firebase)
    ],
    schemas: [ NO_ERRORS_SCHEMA ],
    providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
