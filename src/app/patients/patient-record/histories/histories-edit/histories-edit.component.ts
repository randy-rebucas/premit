import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { HistoryService } from '../../services/history.service';
import { HistoryData } from '../../models/history-data.model';

export interface Types {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-histories-edit',
  templateUrl: './histories-edit.component.html',
  styleUrls: ['./histories-edit.component.css']
})
export class HistoriesEditComponent implements OnInit, OnDestroy {
  perPage = 10;
  currentPage = 1;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  historyData: HistoryData;
  isLoading = false;
  private mode = 'create';
  private recordId: string;
  patientId: string;
  title: string;
  patient: string;
  form: FormGroup;

  maxDate = new Date();

  types: Types[] = [
    {value: 'Allergies', viewValue: 'Allergies'},
    {value: 'Drug', viewValue: 'Drug'},
    {value: 'Social', viewValue: 'Social'},
    {value: 'Family', viewValue: 'Family'},
    {value: 'Surgical', viewValue: 'Surgical'},
    {value: 'Obstetric', viewValue: 'Obstetric'},
    {value: 'Developmental', viewValue: 'Developmental'}
  ];

  constructor(
    public historyService: HistoryService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private datePipe: DatePipe,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < HistoriesEditComponent >,
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
      type: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(150) ]
      }),
      description: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(150) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.historyService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.historyData = {
              id: recordData._id,
              type: recordData.type,
              description: recordData.description,
              created: recordData.created,
              patient: recordData.patient
            };
            this.form.setValue({
              type: this.historyData.type,
              description: this.historyData.description,
              record_date: this.historyData.created
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
      this.historyService.insert(
        this.form.value.type,
        this.form.value.description,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.historyService.getAll(this.perPage, this.currentPage, this.patientId);
      });
    } else {
      this.historyService.update(
        this.recordId,
        this.form.value.type,
        this.form.value.description,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.onClose();
        this.notificationService.success(':: Updated successfully');
        this.historyService.getAll(this.perPage, this.currentPage, this.patientId);
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
