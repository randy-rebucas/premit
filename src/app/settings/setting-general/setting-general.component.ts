import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { mimeType } from 'src/app/patients/patient-edit/mime-type.validator';
import { NotificationService } from 'src/app/shared/notification.service';
import { SettingsService } from '../settings.service';

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
              public settingsService: SettingsService,
              private notificationService: NotificationService,
              private fb: FormBuilder) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = this.fb.group({
        clinic_name: ['', [Validators.required]],
        clinic_address: ['', [Validators.required]],
        clinic_url: ['', [Validators.required]],
        clinic_phone: this.fb.array([this.addClinicContactGroup()]),
        clinic_hours: this.fb.array([this.addClinicHourGroup()])
      });
  }

  addClinicHourGroup() {
    return this.fb.group({
      morning: ['', [Validators.required]],
      afternoon: ['', [Validators.required]]
    });
  }

  addClinicContactGroup() {
    return this.fb.group({
      contact: ['', [Validators.required]]
    });
  }

  get hourArray() {
    return this.form.get('hours') as FormArray;
  }

  get contactArray() {
    return this.form.get('contacts') as FormArray;
  }

  addHour() {
    this.hourArray.push(this.addClinicHourGroup());
  }

  addContact() {
    this.contactArray.push(this.addClinicContactGroup());
  }

  removeHour(index) {
    this.hourArray.removeAt(index);
    this.hourArray.markAsDirty();
    this.hourArray.markAsTouched();
  }

  removeContact(index) {
    this.contactArray.removeAt(index);
    this.contactArray.markAsDirty();
    this.contactArray.markAsTouched();
  }

  onSaveGenSetting() {
    this.settingsService.insert(
      this.form.value.clinic_name,
      this.form.value.clinic_address,
      this.form.value.clinic_url,
      this.form.value.clinic_phone,
      this.form.value.clinic_hours
    ).subscribe(() => {
      this.form.reset();
      this.notificationService.success('::Updated successfully');
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
