import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MenuComponent } from './menu/menu.component';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
      // The locale would typically be provided on the root module of your application. We do it at
      // the component level here, due to limitations of our example generation script.
      {provide: MAT_DATE_LOCALE, useValue: 'en-CA'},

      // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
      // `MatMomentDateModule` in your applications root module. We provide it at the component level
      // here, due to limitations of our example generation script.
      {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
      {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    ],
})

export class AppComponent {



  constructor(private translate: TranslateService) {
       translate.setDefaultLang('fr');
     }
}
