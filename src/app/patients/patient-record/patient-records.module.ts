import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../angular-material.module';
import { EncounterComponent } from './encounter/encounter.component';
import { ChiefComplaintComponent } from './chief-complaint/chief-complaint.component';
import { HistoriesComponent } from './histories/histories.component';
import { PhysicalExamsComponent } from './physical-exams/physical-exams.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { ProgressNotesComponent } from './progress-notes/progress-notes.component';
import { TestResultsComponent } from './test-results/test-results.component';
import { PhysicalExamsModule } from './physical-exams/physical-exams.module';


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
    PhysicalExamsModule,
    RouterModule
  ]
})
export class PatientRecordsModule {}
