import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';

import { PrescriptionService } from '../../services/prescription.service';
import { PrescriptionData } from '../../models/prescription-data.model';
import { ComplaintService } from '../../services/complaint.service';
import { ComplaintData } from '../../models/complaint-data.model';

@Component({
  selector: 'app-prescription-edit',
  templateUrl: './prescription-edit.component.html',
  styleUrls: ['./prescription-edit.component.css']
})
export class PrescriptionEditComponent implements OnInit, OnDestroy {
  perPage = 10;
  currentPage = 1;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  prescriptionData: PrescriptionData;
  ccs: ComplaintData[];

  isLoading = false;
  private mode = 'create';
  private recordId: string;
  patientId: string;
  title: string;
  patient: string;
  complaintId: string;
  form: FormGroup;

  checked = false;

  maxDate = new Date();

  rData: any;

  constructor(
    public complaintService: ComplaintService,
    public prescriptionService: PrescriptionService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private datePipe: DatePipe,
    private fb: FormBuilder,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < PrescriptionEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      this.recordId = data.id;
      this.complaintId = data.complaintIds;
      this.title = data.title;
    }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = this.fb.group({
      record_date: [new Date(), [Validators.required]],
      prescriptions: this.fb.array([this.addPrescriptionGroup()])
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.prescriptionService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;

            this.form.patchValue({
              record_date: recordData.created
            });
            const prescriptionControl = this.form.controls.prescriptions as FormArray;
            const prescription = recordData.prescriptions;
            for (let i = 1; i < prescription.length; i++) {
              prescriptionControl.push(this.addPrescriptionGroup());
            }
            this.form.patchValue({prescriptions: prescription});

          });
        } else {
          this.mode = 'create';
          this.recordId = null;
        }
  }

  addPrescriptionGroup() {
    return this.fb.group({
      maintenableFlg: [],
      medicine: ['', [Validators.required]],
      preparation: ['', [Validators.required]],
      sig: ['', [Validators.required]],
      quantity: [1, [Validators.required]]
    });
  }

  addPrescription() {
    this.prescriptionArray.push(this.addPrescriptionGroup());
  }

  removePrescription(index) {
    this.prescriptionArray.removeAt(index);
    this.prescriptionArray.markAsDirty();
    this.prescriptionArray.markAsTouched();
  }

  get prescriptionArray() {
    return this.form.get('prescriptions') as FormArray;
  }

  onSave() {
    console.log(this.form.value);
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.prescriptionService.insert(
        this.form.value.record_date,
        this.complaintId,
        this.form.value.prescriptions
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.complaintService.getLatest().subscribe(
          recordData => {
            this.complaintId = null;
            if (Object.keys(recordData).length) {
              this.complaintId = recordData[0]._id;
              this.prescriptionService.getAll(this.perPage, this.currentPage, recordData[0]._id);
            }
          }
        );
      });
    } else {
      this.prescriptionService.update(
        this.recordId,
        this.form.value.record_date,
        this.complaintId,
        this.form.value.prescriptions
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.complaintService.getLatest().subscribe(
          recordData => {
            this.complaintId = null;
            if (Object.keys(recordData).length) {
              this.complaintId = recordData[0]._id;
              this.prescriptionService.getAll(this.perPage, this.currentPage, recordData[0]._id);
            }
          }
        );
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
