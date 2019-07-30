import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { HomeComponent } from './home/home.component';
import { PatientsModule } from './patients/patients.module';

import { AppointmentsComponent } from './appointments/appointments.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsGeneralComponent } from './settings/setting-general/setting-general.component';
import { SettingsNotificationComponent } from './settings/setting-notification/setting-notification.component';

import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    PageNotFoundComponent,
    HomeComponent,
    AppointmentsComponent,
    SettingsComponent,
    SettingsGeneralComponent,
    SettingsNotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PatientsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
