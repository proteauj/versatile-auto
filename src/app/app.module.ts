import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
        AngularFileUploaderModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
