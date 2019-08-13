import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ComplaintService } from '../../services/complaint.service';
import { ComplaintData } from '../../models/complaint-data.model';

@Component({
  selector: 'app-chief-complaint-edit',
  templateUrl: './chief-complaint-edit.component.html',
  styleUrls: ['./chief-complaint-edit.component.css']
})
export class ChiefComplaintEditComponent implements OnInit, OnDestroy {
  perPage = 10;
  currentPage = 1;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  complaintData: ComplaintData;
  isLoading = false;
  private mode = 'create';
  private recordId: string;
  patientId: string;
  title: string;
  patient: string;
  form: FormGroup;

  maxDate = new Date();

  constructor(
    public complaintService: ComplaintService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private datePipe: DatePipe,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < ChiefComplaintEditComponent >,
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
      complaint: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(150) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.complaintService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.complaintData = {
              id: recordData._id,
              complaint: recordData.complaint,
              created: recordData.created,
              patient: recordData.patient
            };
            this.form.setValue({
              complaint: this.complaintData.complaint,
              record_date: this.complaintData.created
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
      this.complaintService.insert(
        this.form.value.complaint,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
      });

      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.onClose();
    } else {
      this.complaintService.update(
        this.recordId,
        this.form.value.complaint,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
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
