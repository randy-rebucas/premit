import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { BpService } from '../../../services/bp.service';
import { BpData } from '../../../models/bp-data.model';

@Component({
  selector: 'app-blood-pressure-edit',
  templateUrl: './blood-pressure-edit.component.html',
  styleUrls: ['./blood-pressure-edit.component.css']
})
export class BloodPressureEditComponent implements OnInit, OnDestroy {
    private authListenerSubs: Subscription;
    private mode = 'create';
    private recordId: string;

  perPage = 10;
  currentPage = 1;
  userIsAuthenticated = false;
  isLoading = false;
  patientId: string;
  title: string;
  patient: string;

  form: FormGroup;
  bpData: BpData;

  maxDate = new Date();

  constructor(
    public bpService: BpService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private datePipe: DatePipe,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < BloodPressureEditComponent >,
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
        systolic: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5) ]
      }),
      diastolic: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.bpService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.bpData = {
              id: recordData._id,
              systolic: recordData.systolic,
              diastolic: recordData.diastolic,
              created: recordData.created,
              patient: recordData.patient
            };
            this.form.setValue({
                systolic: this.bpData.systolic,
                diastolic: this.bpData.diastolic,
              record_date: this.bpData.created
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
      this.bpService.insert(
        this.form.value.systolic,
        this.form.value.diastolic,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.bpService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    } else {
      this.bpService.update(
        this.recordId,
        this.form.value.systolic,
        this.form.value.diastolic,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.bpService.getAll(this.perPage, this.currentPage, this.patientId);
      });
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
