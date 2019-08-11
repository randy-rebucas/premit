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
import { HistoriesComponent } from './patients/patient-record/histories/histories.component';
import { PhysicalExamsComponent } from './patients/patient-record/physical-exams/physical-exams.component';
import { AssessmentsComponent } from './patients/patient-record/assessments/assessments.component';
import { PrescriptionsComponent } from './patients/patient-record/prescriptions/prescriptions.component';
import { ProgressNotesComponent } from './patients/patient-record/progress-notes/progress-notes.component';
import { TestResultsComponent } from './patients/patient-record/test-results/test-results.component';
import { HeightComponent } from './patients/patient-record/physical-exams/height/height.component';
import { HeightListComponent } from './patients/patient-record/physical-exams/height/height-list/height-list.component';
import { HeightEditComponent } from './patients/patient-record/physical-exams/height/height-edit/height-edit.component';
import { WeightComponent } from './patients/patient-record/physical-exams/weight/weight.component';
import { BloodPressureComponent } from './patients/patient-record/physical-exams/blood-pressure/blood-pressure.component';
import { TemperatureComponent } from './patients/patient-record/physical-exams/temperature/temperature.component';
import { RespiratoryRateComponent } from './patients/patient-record/physical-exams/respiratory-rate/respiratory-rate.component';

const appRoutes: Routes = [
    // { path: '', redirectTo: '/patients', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'patients', component: PatientListComponent, canActivate: [AuthGuard], children: [
        { path: 'create', component: PatientEditComponent }
    ] },
    { path: 'patient-details/:patientId', component: PatientDetailComponent, canActivate: [AuthGuard], children: [
      { path: '', redirectTo: 'chief-complaint', pathMatch: 'full' },
      { path: 'encounter', component: EncounterComponent },
      { path: 'chief-complaint', component: ChiefComplaintComponent },
      { path: 'histories', component: HistoriesComponent },
      { path: 'physical-exams', component: PhysicalExamsComponent, children: [
        { path: '', redirectTo: 'height', pathMatch: 'full' },
        { path: 'height', component: HeightListComponent, children: [
          { path: 'create', component: HeightEditComponent }
        ] },
        { path: 'weight', component: WeightComponent },
        { path: 'temperature', component: TemperatureComponent },
        { path: 'blood-pressure', component: BloodPressureComponent },
        { path: 'respiratory-rate', component: RespiratoryRateComponent }
      ] },
      { path: 'assessments', component: AssessmentsComponent },
      { path: 'prescriptions', component: PrescriptionsComponent },
      { path: 'progress-notes', component: ProgressNotesComponent },
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

