import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { PatientsComponent } from './patients.component';
import { PatientEditComponent } from './patient-edit/patient-edit.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { PatientRecordComponent } from './patient-record/patient-record.component';


@NgModule({
  declarations: [
    PatientsComponent,
    PatientEditComponent,
    PatientListComponent,
    PatientDetailComponent,
    PatientRecordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PatientsModule {}
