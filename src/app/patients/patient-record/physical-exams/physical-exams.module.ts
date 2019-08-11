import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { HeightComponent } from './height/height.component';
import { HeightListComponent } from './height/height-list/height-list.component';
import { HeightEditComponent } from './height/height-edit/height-edit.component';
import { WeightComponent } from './weight/weight.component';
import { TemperatureComponent } from './temperature/temperature.component';
import { BloodPressureComponent } from './blood-pressure/blood-pressure.component';
import { RespiratoryRateComponent } from './respiratory-rate/respiratory-rate.component';

@NgModule({
  declarations: [
    HeightComponent,
    HeightListComponent,
    HeightEditComponent,
    WeightComponent,
    TemperatureComponent,
    BloodPressureComponent,
    RespiratoryRateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PhysicalExamsModule {}
