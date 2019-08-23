import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { ComplaintService } from '../../services/complaint.service';
import { ComplaintData } from '../../models/complaint-data.model';

@Component({
  selector: 'app-encounter-edit',
  templateUrl: './encounter-edit.component.html',
  styleUrls: ['./encounter-edit.component.css']
})
export class EncounterEditComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  complaintData: ComplaintData;
  isLoading = false;
  complaint: string;
  title: string;

  form: FormGroup;
  constructor(
    private dialog: MatDialog,
    public complaintService: ComplaintService,
    private authService: AuthService,
    private datePipe: DatePipe,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < EncounterEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      this.complaint = data.complaintId;
      this.title = data.title;
    }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.isLoading = true;
    this.complaintService.get(this.complaint).subscribe(recordData => {
      console.log(recordData);
    });
  }

  print(opt) {
    if (opt === 1) {
      this.dialogRef.close();
    } else {
      console.log(opt);
    }
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
