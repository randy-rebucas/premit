import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute, Params, ParamMap, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DatePipe } from '@angular/common';
import { DialogService } from 'src/app/shared/dialog.service';

import { PrescriptionData } from '../../models/prescription-data.model';
import { PrescriptionService } from '../../services/prescription.service';
import { PrescriptionEditComponent } from '../prescription-edit/prescription-edit.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ComplaintService } from '../../services/complaint.service';

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.css']
  // animations: [
  //   trigger('detailExpand', [
  //     state('collapsed', style({height: '0px', minHeight: '0'})),
  //     state('expanded', style({height: '*'})),
  //     transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  //   ]),
  // ]
})

export class PrescriptionListComponent implements OnInit, OnDestroy {
  records: PrescriptionService[] = [];
  prs: PrescriptionData[] = [];
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
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PrescriptionService,
    public prescriptionService: PrescriptionService,
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
    displayedColumns: string[] = ['prescriptions', 'action'];
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

    this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);

    this.recordsSub = this.prescriptionService
      .getUpdateListener()
      .subscribe((prescriptionData: {prescriptions: PrescriptionData[], count: number}) => {
        this.isLoading = false;
        this.total = prescriptionData.count;
        this.dataSource = new MatTableDataSource(prescriptionData.prescriptions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  onPrint() {}

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
  }

  onCreate(complaintId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: null,
      title: 'New record',
      complaintIds: complaintId
    };
    this.dialog.open(PrescriptionEditComponent, dialogConfig);
  }

  onEdit(recordId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        id: recordId,
        title: 'Update record',
        patient: this.patientId
    };
    this.dialog.open(PrescriptionEditComponent, dialogConfig);
  }

  onDelete(recordId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.prescriptionService.delete(recordId).subscribe(() => {
          this.prescriptionService.getAll(this.perPage, this.currentPage, this.patientId);
          this.notificationService.warn('! Deleted successfully');
        });
      }
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
