import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { AssessmentService } from '../../services/assessment.service';
import { ProgressNoteEditComponent } from '../progress-note-edit/progress-note-edit.component';
import { MatDialogConfig, MatDialog } from '@angular/material';

@Component({
  selector: 'app-progress-note-latest',
  templateUrl: './progress-note-latest.component.html',
  styleUrls: ['./progress-note-latest.component.css']
})
export class ProgressNoteLatestComponent implements OnInit, OnDestroy {
  @Input() complaintId: string;
  @Input() patientId: string;

  isLoading = false;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(
    private authService: AuthService,
    public assessmentService: AssessmentService,
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
    this.dialog.open(ProgressNoteEditComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
