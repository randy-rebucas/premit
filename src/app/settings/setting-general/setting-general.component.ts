import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { mimeType } from 'src/app/patients/patient-edit/mime-type.validator';
import { NotificationService } from 'src/app/shared/notification.service';
import { SettingsGeneralService } from '../settings-general.service';

@Component({
  selector: 'app-settings-general',
  templateUrl: './setting-general.component.html',
  styleUrls: ['./setting-general.component.css']
})
export class SettingsGeneralComponent implements OnInit, OnDestroy {
  form: FormGroup;
  userId: string;
  settingId: string;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              public settingsGeneralService: SettingsGeneralService,
              private notificationService: NotificationService,
              private fb: FormBuilder) {
                this.form = this.fb.group({
                  clinic_name: ['', [Validators.required]],
                  clinic_owner: ['', [Validators.required]],
                  clinic_address: [''],
                  clinic_url: [''],
                  clinic_email: [''],
                  prc: [''],
                  ptr: [''],
                  s2: [''],
                  clinic_phone: this.fb.array([this.addClinicContactGroup()]),
                  clinic_hours: this.fb.array([this.addClinicHourGroup()])
                });

                this.userId = this.authService.getUserId();
              }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.populateForm();
  }

  populateForm() {
    this.settingsGeneralService.get(this.userId).subscribe(settingData => {
      this.form.patchValue({
        clinic_name: settingData[0].clinic_name,
        clinic_owner: settingData[0].clinic_owner,
        clinic_address: settingData[0].clinic_address,
        clinic_url: settingData[0].clinic_url,
        clinic_email: settingData[0].clinic_email,
        prc: settingData[0].prc,
        ptr: settingData[0].ptr,
        s2: settingData[0].s2,
      });

      const contactControl = this.form.controls.clinic_phone as FormArray;
      const contacts = settingData[0].clinic_phone;
      for (let i = 1; i < contacts.length; i++) {
        contactControl.push(this.addClinicContactGroup());
      }
      this.form.patchValue({clinic_phone: contacts});

      const hourControl = this.form.controls.clinic_hours as FormArray;
      const hours = settingData[0].clinic_hours;
      for (let i = 1; i < hours.length; i++) {
        hourControl.push(this.addClinicHourGroup());
      }
      this.form.patchValue({clinic_hours: hours});

      this.settingId = settingData[0]._id;
      });
  }

  addClinicHourGroup() {
    return this.fb.group({
      morning_open: [''],
      morning_close: [''],
      afternoon_open: [''],
      afternoon_close: ['']
    });
  }

  addClinicContactGroup() {
    return this.fb.group({
      contact: ['']
    });
  }

  get hourArray() {
    return this.form.get('clinic_hours') as FormArray;
  }

  get contactArray() {
    return this.form.get('clinic_phone') as FormArray;
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
    this.settingsGeneralService.update(
      this.settingId,
      this.form.value.clinic_name,
      this.form.value.clinic_owner,
      this.form.value.clinic_address,
      this.form.value.clinic_email,
      this.form.value.clinic_url,
      this.form.value.prc,
      this.form.value.ptr,
      this.form.value.s2,
      this.form.value.clinic_phone,
      this.form.value.clinic_hours
    ).subscribe(() => {
      // this.form.reset();
      // this.populateForm();
      this.notificationService.success('::Updated successfully');
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
