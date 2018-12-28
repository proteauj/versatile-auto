import { NgModule } from '@angular/core';
import {
  MdcButtonModule,
  MdcCardModule,
  MdcCheckboxModule,
  MdcDialogModule,
  MdcDrawerModule,
  MdcElevationModule,
  MdcFabModule,
  MdcFormFieldModule,
  MdcIconModule,
  MdcLinearProgressModule,
  MdcListModule,
  MdcMenuModule,
  MdcRadioModule,
  MdcRippleModule,
  MdcSelectModule,
  MdcSliderModule,
  MdcSnackbarModule,
  MdcSwitchModule,
  MdcTextFieldModule,
  MdcTypographyModule,
} from '@angular-mdc/web';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule
} from '@angular/material';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatTableModule,
    MatChipsModule,
    MatExpansionModule,
    MatMenuModule
  ],
  exports: [
    MdcButtonModule,
    MdcCardModule,
    MdcCheckboxModule,
    MdcDialogModule,
    MdcDrawerModule,
    MdcElevationModule,
    MdcFabModule,
    MdcFormFieldModule,
    MdcIconModule,
    MdcLinearProgressModule,
    MdcListModule,
    MdcMenuModule,
    MdcRadioModule,
    MdcRippleModule,
    MdcSelectModule,
    MdcSliderModule,
    MdcSnackbarModule,
    MdcSwitchModule,
    MdcTextFieldModule,
    MdcTypographyModule,

    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatTableModule,
    MatChipsModule,
    MatExpansionModule,
    MatMenuModule
  ]
})
export class AppMaterialModule { }
