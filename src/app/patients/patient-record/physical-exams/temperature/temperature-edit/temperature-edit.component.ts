import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';

import { TemperatureService } from '../../../services/temperature.service';
import { TemperatureData } from '../../../models/temperature-data.model';

@Component({
  selector: 'app-temperature-edit',
  templateUrl: './temperature-edit.component.html',
  styleUrls: ['./temperature-edit.component.css']
})
export class TemperatureEditComponent implements OnInit, OnDestroy {
  perPage = 10;
  currentPage = 1;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  temperatureData: TemperatureData;
  isLoading = false;
  private mode = 'create';
  private recordId: string;
  patientId: string;
  title: string;
  patient: string;
  form: FormGroup;

  maxDate = new Date();

  constructor(
    public temperatureService: TemperatureService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private datePipe: DatePipe,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < TemperatureEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      this.recordId = data.id;
      this.patientId = data.patient;
      this.title = data.title;
    }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = new FormGroup({
      temperature: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.temperatureService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.temperatureData = {
              id: recordData._id,
              temperature: recordData.temperature,
              created: recordData.created,
              patient: recordData.patient
            };
            this.form.setValue({
            temperature: this.temperatureData.temperature,
              record_date: this.temperatureData.created
            });
          });
        } else {
          this.mode = 'create';
          this.recordId = null;
        }
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.temperatureService.insert(
        this.form.value.temperature,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.temperatureService.getAll(this.perPage, this.currentPage, this.patientId);
      });

      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.onClose();
    } else {
      this.temperatureService.update(
        this.recordId,
        this.form.value.temperature,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.temperatureService.getAll(this.perPage, this.currentPage, this.patientId);
      });

      this.form.reset();
      this.notificationService.success(':: Updated successfully');
      this.onClose();
    }
  }

  onClose() {
    this.form.reset();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
