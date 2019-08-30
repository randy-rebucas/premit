import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { AssessmentService } from '../../services/assessment.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { PrescriptionEditComponent } from '../prescription-edit/prescription-edit.component';
import { RxPadComponent } from 'src/app/rx-pad/rx-pad.component';

@Component({
  selector: 'app-prescription-latest',
  templateUrl: './prescription-latest.component.html',
  styleUrls: ['./prescription-latest.component.css']
})
export class PrescriptionLatestComponent implements OnInit, OnDestroy {
  @Input() complaintId: string;
  @Input() patientId: string;
  @Input() prescriptionId: string;

  isLoading = false;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(
    public assessmentService: AssessmentService,
    private authService: AuthService,
    private dialog: MatDialog
    ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onCreate(complaintId, patientId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: null,
      title: 'New record',
      complaintIds: complaintId,
      patient: patientId
    };
    this.dialog.open(PrescriptionEditComponent, dialogConfig);
  }

  onPrintPreview(recordId, patient) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = {
      id: recordId,
      title: 'Print preview',
      patientId: patient
    };
    this.dialog.open(RxPadComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
