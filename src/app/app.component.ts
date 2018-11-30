import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { MenuComponent } from './menu/menu.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {



  constructor(private translate: TranslateService) {
       translate.setDefaultLang('fr');
     }
}
