import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../angular-material.module';
import { EncounterComponent } from './encounter/encounter.component';
import { ChiefComplaintComponent } from './chief-complaint/chief-complaint.component';
import { ChiefComplaintEditComponent } from './chief-complaint/chief-complaint-edit/chief-complaint-edit.component';
import { ChiefComplaintListComponent } from './chief-complaint/chief-complaint-list/chief-complaint-list.component';
import { ChiefComplaintLatestComponent } from './chief-complaint/chief-complaint-latest/chief-complaint-latest.component';
import { HistoriesComponent } from './histories/histories.component';
import { HistoriesEditComponent } from './histories/histories-edit/histories-edit.component';
import { HistoriesListComponent } from './histories/histories-list/histories-list.component';
import { PhysicalExamsComponent } from './physical-exams/physical-exams.component';
import { AssessmentsComponent } from './assessments/assessments.component';
import { AssessmentEditComponent } from './assessments/assessment-edit/assetment-edit.component';
import { AssessmentListComponent } from './assessments/assessment-list/assessment-list.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { PrescriptionEditComponent } from './prescriptions/prescription-edit/prescription-edit.component';
import { PrescriptionListComponent } from './prescriptions/prescription-list/prescription-list.component';
import { ProgressNotesComponent } from './progress-notes/progress-notes.component';
import { ProgressNoteEditComponent } from './progress-notes/progress-note-edit/progress-note-edit.component';
import { ProgressNoteListComponent } from './progress-notes/progress-note-list/progress-note-list.component';
import { TestResultsComponent } from './test-results/test-results.component';
import { PhysicalExamsModule } from './physical-exams/physical-exams.module';


@NgModule({
  declarations: [
    EncounterComponent,
    ChiefComplaintComponent,
    ChiefComplaintEditComponent,
    ChiefComplaintListComponent,
    ChiefComplaintLatestComponent,
    HistoriesComponent,
    HistoriesEditComponent,
    HistoriesListComponent,
    PhysicalExamsComponent,
    AssessmentsComponent,
    AssessmentEditComponent,
    AssessmentListComponent,
    PrescriptionsComponent,
    PrescriptionEditComponent,
    PrescriptionListComponent,
    ProgressNotesComponent,
    TestResultsComponent,
    ProgressNoteEditComponent,
    ProgressNoteListComponent
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
