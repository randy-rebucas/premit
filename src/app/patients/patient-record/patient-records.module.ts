import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../angular-material.module';
import { EncountersComponent } from './encounters/encounters.component';
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
import { AssessmentLatestComponent } from './assessments/assessment-latest/assessment-latest.component';
import { PrescriptionsComponent } from './prescriptions/prescriptions.component';
import { PrescriptionEditComponent } from './prescriptions/prescription-edit/prescription-edit.component';
import { PrescriptionListComponent } from './prescriptions/prescription-list/prescription-list.component';
import { ProgressNotesComponent } from './progress-notes/progress-notes.component';
import { ProgressNoteEditComponent } from './progress-notes/progress-note-edit/progress-note-edit.component';
import { ProgressNoteListComponent } from './progress-notes/progress-note-list/progress-note-list.component';
import { TestResultsComponent } from './test-results/test-results.component';
import { PhysicalExamsModule } from './physical-exams/physical-exams.module';
import { ChiefComplaintDetailComponent } from './chief-complaint/chief-complaint-detail/chief-complaint-detail.component';
import { EncounterListComponent } from './encounters/encounter-list/encounter-list.component';
import { EncounterEditComponent } from './encounters/encounter-edit/encounter-edit.component';
import { PrescriptionLatestComponent } from './prescriptions/prescription-latest/prescription-latest.component';
import { ProgressNoteLatestComponent } from './progress-notes/progress-note-latest/progress-note-latest.component';


@NgModule({
  declarations: [
    EncountersComponent,
    EncounterListComponent,
    EncounterEditComponent,
    ChiefComplaintComponent,
    ChiefComplaintEditComponent,
    ChiefComplaintListComponent,
    ChiefComplaintLatestComponent,
    ChiefComplaintDetailComponent,
    HistoriesComponent,
    HistoriesEditComponent,
    HistoriesListComponent,
    PhysicalExamsComponent,
    AssessmentsComponent,
    AssessmentEditComponent,
    AssessmentListComponent,
    AssessmentLatestComponent,
    PrescriptionsComponent,
    PrescriptionEditComponent,
    PrescriptionListComponent,
    PrescriptionLatestComponent,
    ProgressNotesComponent,
    TestResultsComponent,
    ProgressNoteEditComponent,
    ProgressNoteListComponent,
    ProgressNoteLatestComponent
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
