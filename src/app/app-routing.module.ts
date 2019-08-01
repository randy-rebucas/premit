import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth-guard';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { PatientEditComponent } from './patients/patient-edit/patient-edit.component';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';
import { PatientListComponent } from './patients/patient-list/patient-list.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsGeneralComponent } from './settings/setting-general/setting-general.component';
import { SettingsNotificationComponent } from './settings/setting-notification/setting-notification.component';

const appRoutes: Routes = [
    // { path: '', redirectTo: '/patients', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'patients', component: PatientListComponent, canActivate: [AuthGuard]},
    // { path: 'create', component: PatientEditComponent, canActivate: [AuthGuard] },
    { path: 'patients/:patientId', component: PatientDetailComponent, canActivate: [AuthGuard] },

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

