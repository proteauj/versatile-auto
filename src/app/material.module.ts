import { NgModule } from '@angular/core';
import {
  MdcButtonModule,
  MdcIconModule,
  MdcCardModule,
  MdcIconButtonModule,
  MdcRippleModule,
  MdcTextFieldModule,
  MdcListModule,
  MdcTypographyModule,
} from '@angular-mdc/web';

@NgModule({
  exports: [
    MdcCardModule,
    MdcButtonModule,
    MdcIconModule,
    MdcIconButtonModule,
    MdcRippleModule,
    MdcTextFieldModule,
    MdcListModule,
    MdcTypographyModule,
  ]
})
export class AppMaterialModule { }
