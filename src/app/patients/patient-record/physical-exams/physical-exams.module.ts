import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { HeightComponent } from './height/height.component';
import { HeightListComponent } from './height/height-list/height-list.component';
import { HeightEditComponent } from './height/height-edit/height-edit.component';
import { WeightComponent } from './weight/weight.component';
import { WeightListComponent } from './weight/weight-list/weight-list.component';
import { WeightEditComponent } from './weight/weight-edit/weight-edit.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { TemperatureListComponent } from './temperature/temperature-list/temperature-list.component';
import { TemperatureEditComponent } from './temperature/temperature-edit/temperature-edit.component';
import { BloodPressureComponent } from './blood-pressure/blood-pressure.component';
import { BloodPressureListComponent } from './blood-pressure/blood-pressure-list/blood-pressure-list.component';
import { BloodPressureEditComponent } from './blood-pressure/blood-pressure-edit/blood-pressure-edit.component';
import { RespiratoryRateComponent } from './respiratory-rate/respiratory-rate.component';
import { RespiratoryRateEditComponent } from './respiratory-rate/respiratory-rate-edit/respiratory-rate-edit.component';
import { RespiratoryRateListComponent } from './respiratory-rate/respiratory-rate-list/respiratory-rate-list.component';

@NgModule({
  declarations: [
    HeightComponent,
    HeightListComponent,
    HeightEditComponent,
    WeightComponent,
    WeightListComponent,
    WeightEditComponent,
    TemperatureComponent,
    TemperatureListComponent,
    TemperatureEditComponent,
    BloodPressureComponent,
    BloodPressureListComponent,
    BloodPressureEditComponent,
    RespiratoryRateComponent,
    RespiratoryRateListComponent,
    RespiratoryRateEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PhysicalExamsModule {}
