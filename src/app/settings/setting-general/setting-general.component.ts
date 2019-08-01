import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { mimeType } from 'src/app/patients/patient-edit/mime-type.validator';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-settings-general',
  templateUrl: './setting-general.component.html',
  styleUrls: ['./setting-general.component.css']
})
export class SettingsGeneralComponent implements OnInit, OnDestroy {
  form: FormGroup;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private notificationService: NotificationService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = new FormGroup({
        perPage: new FormControl('5', {
          validators: [Validators.required, Validators.maxLength(2) ]
        })
      });
    this.form.setValue({
      perPage: 5
      });
  }

  onSaveGenSetting() {
    // this.patientsService.addPatient(
    //   this.form.value.firstname,
    //   this.form.value.midlename,
    //   this.form.value.lastname,
    //   this.form.value.contact,
    //   this.form.value.gender,
    //   this.form.value.birthdate,
    //   this.form.value.address,
    //   this.form.value.image
    // ).subscribe(() => {
    //   this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
    // });

    this.notificationService.success(':: Added successfully');
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
