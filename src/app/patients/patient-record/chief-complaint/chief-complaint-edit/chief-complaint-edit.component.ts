import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ComplaintService } from '../../services/complaint.service';
import { ComplaintData } from '../../models/complaint-data.model';
import { EncounterEditComponent } from '../../encounters/encounter-edit/encounter-edit.component';

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
  complainId: string;

  form: FormGroup;

  maxDate = new Date();

  constructor(
    private dialog: MatDialog,
    public complaintService: ComplaintService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private datePipe: DatePipe,
    private fb: FormBuilder,

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

    this.form = this.fb.group({
        record_date: [new Date(), [Validators.required]],
        complaints: this.fb.array([this.addComplaintGroup()])
      });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.complaintService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.form.patchValue({
              record_date: recordData.created
            });
            const complaintControl = this.form.controls.complaints as FormArray;
            const complaintArray = recordData.complaints;
            for (let i = 1; i < complaintArray.length; i++) {
              complaintControl.push(this.addComplaintGroup());
            }
            this.form.patchValue({complaints: complaintArray});
          });
        } else {
          this.mode = 'create';
          this.recordId = null;
        }
  }

  addComplaintGroup() {
    return this.fb.group({
      complaint: ['', [Validators.required, Validators.maxLength(150)]]
    });
  }

  addComplaint() {
    this.complaintArray.push(this.addComplaintGroup());
  }

  removeComplaint(index) {
    this.complaintArray.removeAt(index);
    this.complaintArray.markAsDirty();
    this.complaintArray.markAsTouched();
  }

  get complaintArray() {
    return this.form.get('complaints') as FormArray;
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.complaintService.insert(
        this.form.value.record_date,
        this.patientId,
        this.form.value.complaints
      ).subscribe((complaintData) => {
        this.onClose();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '90%';
        dialogConfig.data = {
          id: null,
          title: 'New encounter',
          complaintId: complaintData.complaint.id
        };
        this.dialog.open(EncounterEditComponent, dialogConfig);
      });
    } else {
      this.complaintService.update(
        this.recordId,
        this.form.value.record_date,
        this.patientId,
        this.form.value.complaints
      ).subscribe((complaintData) => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
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
