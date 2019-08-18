import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth-guard';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { PatientEditComponent } from './patients/patient-edit/patient-edit.component';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';
import { PatientListComponent } from './patients/patient-list/patient-list.component';
import { EncounterComponent } from './patients/patient-record/encounter/encounter.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsGeneralComponent } from './settings/setting-general/setting-general.component';
import { SettingsNotificationComponent } from './settings/setting-notification/setting-notification.component';
import { ChiefComplaintComponent } from './patients/patient-record/chief-complaint/chief-complaint.component';
import { ChiefComplaintEditComponent } from './patients/patient-record/chief-complaint/chief-complaint-edit/chief-complaint-edit.component';
import { ChiefComplaintListComponent } from './patients/patient-record/chief-complaint/chief-complaint-list/chief-complaint-list.component';
import { HistoriesComponent } from './patients/patient-record/histories/histories.component';
import { HistoriesListComponent } from './patients/patient-record/histories/histories-list/histories-list.component';
import { HistoriesEditComponent } from './patients/patient-record/histories/histories-edit/histories-edit.component';
import { PhysicalExamsComponent } from './patients/patient-record/physical-exams/physical-exams.component';
import { AssessmentsComponent } from './patients/patient-record/assessments/assessments.component';
import { AssessmentListComponent } from './patients/patient-record/assessments/assessment-list/assessment-list.component';
import { AssessmentEditComponent } from './patients/patient-record/assessments/assessment-edit/assetment-edit.component';
import { PrescriptionsComponent } from './patients/patient-record/prescriptions/prescriptions.component';
import { PrescriptionEditComponent } from './patients/patient-record/prescriptions/prescription-edit/prescription-edit.component';
import { PrescriptionListComponent } from './patients/patient-record/prescriptions/prescription-list/prescription-list.component';
import { ProgressNotesComponent } from './patients/patient-record/progress-notes/progress-notes.component';
import { ProgressNoteListComponent } from './patients/patient-record/progress-notes/progress-note-list/progress-note-list.component';
import { ProgressNoteEditComponent } from './patients/patient-record/progress-notes/progress-note-edit/progress-note-edit.component';
import { TestResultsComponent } from './patients/patient-record/test-results/test-results.component';
import { HeightComponent } from './patients/patient-record/physical-exams/height/height.component';
import { HeightListComponent } from './patients/patient-record/physical-exams/height/height-list/height-list.component';
import { HeightEditComponent } from './patients/patient-record/physical-exams/height/height-edit/height-edit.component';
import { WeightComponent } from './patients/patient-record/physical-exams/weight/weight.component';
import { WeightListComponent } from './patients/patient-record/physical-exams/weight/weight-list/weight-list.component';
import { WeightEditComponent } from './patients/patient-record/physical-exams/weight/weight-edit/weight-edit.component';
import { BloodPressureComponent } from './patients/patient-record/physical-exams/blood-pressure/blood-pressure.component';
// tslint:disable-next-line: max-line-length
import { BloodPressureEditComponent } from './patients/patient-record/physical-exams/blood-pressure/blood-pressure-edit/blood-pressure-edit.component';
// tslint:disable-next-line: max-line-length
import { BloodPressureListComponent } from './patients/patient-record/physical-exams/blood-pressure/blood-pressure-list/blood-pressure-list.component';
import { TemperatureComponent } from './patients/patient-record/physical-exams/temperature/temperature.component';
import { TemperatureEditComponent } from './patients/patient-record/physical-exams/temperature/temperature-edit/temperature-edit.component';
import { TemperatureListComponent } from './patients/patient-record/physical-exams/temperature/temperature-list/temperature-list.component';
import { RespiratoryRateComponent } from './patients/patient-record/physical-exams/respiratory-rate/respiratory-rate.component';
// tslint:disable-next-line:max-line-length
import { RespiratoryRateEditComponent } from './patients/patient-record/physical-exams/respiratory-rate/respiratory-rate-edit/respiratory-rate-edit.component';
// tslint:disable-next-line:max-line-length
import { RespiratoryRateListComponent } from './patients/patient-record/physical-exams/respiratory-rate/respiratory-rate-list/respiratory-rate-list.component';
import { ChiefComplaintLatestComponent } from './patients/patient-record/chief-complaint/chief-complaint-latest/chief-complaint-latest.component';

const appRoutes: Routes = [
    // { path: '', redirectTo: '/patients', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'patients', component: PatientListComponent, canActivate: [AuthGuard], children: [
        { path: 'create', component: PatientEditComponent }
    ] },
    { path: 'patient-details/:patientId', component: PatientDetailComponent, canActivate: [AuthGuard], children: [
      { path: '', redirectTo: 'physical-exams', pathMatch: 'full' },
      { path: 'encounter', component: EncounterComponent },
      { path: 'chief-complaint', component: ChiefComplaintListComponent, children: [
        { path: 'create', component: ChiefComplaintEditComponent }
      ] },
      { path: 'histories', component: HistoriesListComponent, children: [
        { path: 'create', component: HistoriesEditComponent }
      ] },
      { path: 'physical-exams', component: PhysicalExamsComponent, children: [
        { path: '', redirectTo: 'height', pathMatch: 'full' },
        { path: 'height', component: HeightListComponent, children: [
          { path: 'create', component: HeightEditComponent }
        ] },
        { path: 'weight', component: WeightListComponent, children: [
          { path: 'create', component: WeightEditComponent }
        ] },
        { path: 'temperature', component: TemperatureListComponent, children: [
          { path: 'create', component: TemperatureEditComponent }
        ] },
        { path: 'blood-pressure', component: BloodPressureListComponent, children: [
          { path: 'create', component: BloodPressureEditComponent }
        ] },
        { path: 'respiratory-rate', component: RespiratoryRateListComponent, children: [
          { path: 'create', component: RespiratoryRateEditComponent }
        ] }
      ] },
      { path: 'assessments', component: AssessmentsComponent, children: [
        { path: '', component: AssessmentListComponent },
        // { path: 'new', component: RecipeEditComponent },
        // { path: ':id', component: RecipeDetailComponent },
        { path: 'create', component: AssessmentEditComponent }
      ] },
      { path: 'prescriptions', component: PrescriptionListComponent, children: [
        { path: 'create', component: PrescriptionEditComponent }
      ] },
      { path: 'progress-notes', component: ProgressNoteListComponent, children: [
        { path: 'create', component: ProgressNoteEditComponent }
      ] },
      { path: 'test-results', component: TestResultsComponent }
    ] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], children: [
      { path: '', redirectTo: '/settings/general', pathMatch: 'full' },
      { path: 'general', component: SettingsGeneralComponent },
      { path: 'notifications', component: SettingsNotificationComponent }
    ] },
    { path: 'appointments', component: AppointmentsComponent, canActivate: [AuthGuard] },

    { path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
    { path: 'not-found', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/not-found' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true }
        )
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {

}

