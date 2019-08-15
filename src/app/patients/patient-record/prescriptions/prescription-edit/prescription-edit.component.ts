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
  isLoading = false;
  private mode = 'create';
  private recordId: string;
  patientId: string;
  title: string;
  patient: string;
  form: FormGroup;

  checked = false;

  maxDate = new Date();

  constructor(
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

    this.form = this.fb.group({
      record_date: [],
      prescriptions: this.fb.array([this.addPrescriptionGroup()])
    });

    // if (this.recordId) {
    //       this.mode = 'edit';
    //       this.isLoading = true;
    //       this.prescriptionService.get(this.recordId).subscribe(recordData => {
    //         this.isLoading = false;
    //         this.prescriptionData = {
    //           id: recordData._id,
    //           prescriptions: recordData.prescription,
    //           created: recordData.created,
    //           patient: recordData.patient
    //         };
    //         // this.form.setValue({
    //         //   medicine: this.prescriptionData.medicine,
    //         //   preparation: this.prescriptionData.preparation,
    //         //   sig: this.prescriptionData.sig,
    //         //   quantity: this.prescriptionData.quantity,
    //         //   record_date: this.prescriptionData.created
    //         // });
    //       });
    //     } else {
    //       this.mode = 'create';
    //       this.recordId = null;
    //     }
  }

  addPrescriptionGroup() {
    return this.fb.group({
      maintenableFlg: [],
      medicine: [],
      preparation: [],
      sig: [],
      quantity: []
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
        this.form.value.prescriptions,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
      });

      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.onClose();
    } else {
      this.prescriptionService.update(
        this.recordId,
        this.form.value.prescriptions,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
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
