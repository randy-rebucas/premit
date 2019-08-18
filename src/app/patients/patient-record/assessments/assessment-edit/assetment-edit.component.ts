import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentData } from '../../models/assessment-data.model';

@Component({
  selector: 'app-assessment-edit',
  templateUrl: './assetment-edit.component.html',
  styleUrls: ['./assetment-edit.component.css']
})
export class AssessmentEditComponent implements OnInit, OnDestroy {
  perPage = 10;
  currentPage = 1;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  assessmentData: AssessmentData;
  isLoading = false;
  private mode = 'create';
  private recordId: string;
  patientId: string;
  title: string;
  form: FormGroup;

  maxDate = new Date();

  constructor(
    public assessmentService: AssessmentService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < AssessmentEditComponent >,
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
        diagnosis: this.fb.array([this.addDiagnosisGroup()]),
        treatments: this.fb.array([this.addTreatmentsGroup()])
      });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.assessmentService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            const diagnosisControl = this.form.controls.complaints as FormArray;
            const diagnosisArray = recordData.diagnosis;
            for (let i = 1; i < diagnosisArray.length; i++) {
              diagnosisControl.push(this.addDiagnosisGroup());
            }
            this.form.patchValue({diagnoses: diagnosisArray});

            const treatmentsControl = this.form.controls.complaints as FormArray;
            const treatmentsArray = recordData.treatments;
            for (let i = 1; i < treatmentsArray.length; i++) {
              treatmentsControl.push(this.addTreatmentsGroup());
            }
            this.form.patchValue({treatments: treatmentsArray});
          });
        } else {
          this.mode = 'create';
          this.recordId = null;
        }
  }

  addDiagnosisGroup() {
    return this.fb.group({
      diagnosis: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }

  addTreatmentsGroup() {
    return this.fb.group({
      treatments: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }

  addDiagnose() {
    this.diagnosisArray.push(this.addDiagnosisGroup());
  }

  addTreatment() {
    this.diagnosisArray.push(this.addTreatmentsGroup());
  }

  removeDiagnose(index) {
    this.diagnosisArray.removeAt(index);
    this.diagnosisArray.markAsDirty();
    this.diagnosisArray.markAsTouched();
  }

  removeTreatment(index) {
    this.treatmentsArray.removeAt(index);
    this.treatmentsArray.markAsDirty();
    this.treatmentsArray.markAsTouched();
  }

  get diagnosisArray() {
    return this.form.get('diagnosis') as FormArray;
  }

  get treatmentsArray() {
    return this.form.get('treatments') as FormArray;
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.assessmentService.insert(
        this.form.value.diagnoses,
        this.form.value.treatments
      ).subscribe(() => {
        this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);
      });

      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.onClose();
    } else {
      this.assessmentService.update(
        this.recordId,
        this.form.value.diagnoses,
        this.form.value.treatments
      ).subscribe(() => {
        this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);
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
