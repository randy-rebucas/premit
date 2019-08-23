import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { AssessmentService } from '../../services/assessment.service';
import { MatDialogConfig, MatDialog } from '@angular/material';

import { AssessmentEditComponent } from '../assessment-edit/assetment-edit.component';

@Component({
  selector: 'app-assessment-latest',
  templateUrl: './assessment-latest.component.html',
  styleUrls: ['./assessment-latest.component.css']
})
export class AssessmentLatestComponent implements OnInit, OnDestroy {
  @Input() complaintId: string;

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

  onCreate(complaintId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
      id: null,
      title: 'New record',
      complaintIds: complaintId
    };
    this.dialog.open(AssessmentEditComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
