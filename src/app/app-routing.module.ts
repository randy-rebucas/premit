import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth-guard';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { PatientEditComponent } from './patients/patient-edit/patient-edit.component';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';
import { PatientListComponent } from './patients/patient-list/patient-list.component';

const appRoutes: Routes = [
    // { path: '', redirectTo: '/patients', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'patient-detail', component: PatientDetailComponent, canActivate: [AuthGuard], children: [
        { path: 'new', component: PatientEditComponent },
        { path: ':id', component: PatientDetailComponent },
        { path: ':id/edit', component: PatientEditComponent }
    ] },
    { path: 'patients', component: PatientListComponent, canActivate: [AuthGuard] },
    { path: 'create', component: PatientEditComponent, canActivate: [AuthGuard] },
    { path: 'edit/:patientId', component: PatientEditComponent, canActivate: [AuthGuard] },

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

