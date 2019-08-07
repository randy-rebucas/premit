import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../angular-material.module';
import { EncounterComponent } from './../patient-record/encounter/encounter.component';
import { ChiefComplaintComponent } from './../patient-record/chief-complaint/chief-complaint.component';
import { HistoriesComponent } from './../patient-record/histories/histories.component';
import { PhysicalExamsComponent } from './../patient-record/physical-exams/physical-exams.component';
import { AssessmentsComponent } from './../patient-record/assessments/assessments.component';
import { PrescriptionsComponent } from './../patient-record/prescriptions/prescriptions.component';
import { ProgressNotesComponent } from './../patient-record/progress-notes/progress-notes.component';
import { TestResultsComponent } from './../patient-record/test-results/test-results.component';
import { PhysicalExamModule } from './physical-exams/physical-exams.module';


@NgModule({
  declarations: [
    EncounterComponent,
    ChiefComplaintComponent,
    HistoriesComponent,
    PhysicalExamsComponent,
    AssessmentsComponent,
    PrescriptionsComponent,
    ProgressNotesComponent,
    TestResultsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PhysicalExamModule,
    RouterModule
  ]
})
export class RecordsModule {}
