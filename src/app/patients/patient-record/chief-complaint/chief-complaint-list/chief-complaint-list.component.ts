import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute, Params, ParamMap, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { ComplaintData } from '../../models/complaint-data.model';
import { ComplaintService } from '../../services/complaint.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DatePipe } from '@angular/common';
import { DialogService } from 'src/app/shared/dialog.service';

import { ChiefComplaintEditComponent } from '../chief-complaint-edit/chief-complaint-edit.component';
import { AssessmentService } from '../../services/assessment.service';
import { PrescriptionService } from '../../services/prescription.service';
import { NotesService } from '../../services/notes.service';

@Component({
  selector: 'app-chief-complaint-list',
  templateUrl: './chief-complaint-list.component.html',
  styleUrls: ['./chief-complaint-list.component.css']
})
export class ChiefComplaintListComponent implements OnInit, OnDestroy {
  records: ComplaintService[] = [];
  complaints: ComplaintData[] = [];
  isLoading = false;
  total = 0;
  perPage = 10;
  currentPage = 1;

  pageSizeOptions = [5, 10, 25, 100];
  id: string;

  userIsAuthenticated = false;
  patientId: string;

  private recordsSub: Subscription;
  private authListenerSubs: Subscription;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ComplaintService,
    public complaintService: ComplaintService,
    public assessmentService: AssessmentService,
    public prescriptionService: PrescriptionService,
    public notesService: NotesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialogService: DialogService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService) {
      const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
      const splitUrl = snapshot.url.split('/');
      this.patientId = splitUrl[2];
    }

    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['complaints', 'created', 'action'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.isLoading = true;
    this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);

    this.recordsSub = this.complaintService
      .getUpdateListener()
      .subscribe((complaintData: {complaints: ComplaintData[], count: number}) => {
        this.isLoading = false;
        this.total = complaintData.count;
        this.complaints = complaintData.complaints;

        this.dataSource = new MatTableDataSource(complaintData.complaints);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
  }

  onFilter(recordId) {
    this.router.navigate(['./', recordId], {relativeTo: this.route});
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
      id: null,
      title: 'New record',
      patient: this.patientId
    };
    this.dialog.open(ChiefComplaintEditComponent, dialogConfig);
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
    this.dialog.open(ChiefComplaintEditComponent, dialogConfig);
  }

  onDelete(recordId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {

        this.complaintService.delete(recordId).subscribe(() => {
          this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
          this.notificationService.warn('! Deleted successfully');
        });

        // this.assessmentService.getByComplaintId(recordId).subscribe(
        //   assessmenrData => {
        // this.assessmentService.delete(assessmenrData[0]._id).subscribe(() => {
        //   this.prescriptionService.getByComplaintId(recordId).subscribe(
        //     prescriptionData => {
        //     this.prescriptionService.delete(prescriptionData[0]._id).subscribe(() => {
        //       this.notesService.getByComplaintId(recordId).subscribe(
        //         noteData => {
        //         this.notesService.delete(noteData[0]._id).subscribe(() => {
        //           this.complaintService.delete(recordId).subscribe(() => {
        //             this.complaintService.getAll(this.perPage, this.currentPage, this.patientId);
        //             this.notificationService.warn('! Deleted successfully');
        //           });
        //         });
        //         }
        //       );
        //     });
        //     }
        //   );
        // });
        //   }
        // );
      }
    });
  }

  onPrint() {

  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
