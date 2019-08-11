import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { WeightService } from '../../../services/weight.service';
import { WeightData } from '../../../models/weight-data.model';

@Component({
  selector: 'app-weight-edit',
  templateUrl: './weight-edit.component.html',
  styleUrls: ['./weight-edit.component.css']
})
export class WeightEditComponent implements OnInit, OnDestroy {
  perPage = 10;
  currentPage = 1;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  weightData: WeightData;
  isLoading = false;
  private mode = 'create';
  private recordId: string;
  patientId: string;
  title: string;
  patient: string;
  form: FormGroup;

  maxDate = new Date();

  constructor(
    public weightService: WeightService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private datePipe: DatePipe,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < WeightEditComponent >,
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
      weight: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(5) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.weightService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.weightData = {
              id: recordData._id,
              weight: recordData.weight,
              created: recordData.created,
              patient: recordData.patient
            };
            this.form.setValue({
              weight: this.weightData.weight,
              record_date: this.weightData.created
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
      this.weightService.insert(
        this.form.value.weight,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.weightService.getAll(this.perPage, this.currentPage, this.patientId);
      });

      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.onClose();
    } else {
      this.weightService.update(
        this.recordId,
        this.form.value.weight,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.weightService.getAll(this.perPage, this.currentPage, this.patientId);
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
