import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, MatDialogConfig } from '@angular/material';
import { DatePipe } from '@angular/common';
import { DialogService } from 'src/app/shared/dialog.service';

import { AssessmentData } from '../../models/assessment-data.model';
import { AssessmentService } from '../../services/assessment.service';
import { AssessmentEditComponent } from '../assessment-edit/assetment-edit.component';
import { ComplaintService } from '../../services/complaint.service';

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.css']
})
export class AssessmentListComponent implements OnInit, OnDestroy {
  records: AssessmentService[] = [];
  assessments: AssessmentData[] = [];
  isLoading = false;

  total = 0;
  perPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];

  userIsAuthenticated = false;
  patientId: string;
  complaintId: string;

  private recordsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: AssessmentService,
    public assessmentService: AssessmentService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private dialogService: DialogService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    public complaintService: ComplaintService) {
      const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
      const splitUrl = snapshot.url.split('/');
      this.patientId = splitUrl[2];
    }

    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['diagnosis', 'treatments', 'action'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.isLoading = true;

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);

    this.recordsSub = this.assessmentService
      .getUpdateListener()
      .subscribe((assessmentData: {assessments: AssessmentData[], count: number}) => {
        this.isLoading = false;
        this.total = assessmentData.count;
        this.dataSource = new MatTableDataSource(assessmentData.assessments);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  onEdit(recordId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
        id: recordId,
        title: 'Update record',
        patient: this.patientId
    };
    this.dialog.open(AssessmentEditComponent, dialogConfig);
  }

  onDelete(recordId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.assessmentService.delete(recordId).subscribe(() => {
          this.assessmentService.getAll(this.perPage, this.currentPage, this.patientId);
          this.notificationService.warn('! Deleted successfully');
        });
      }
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
