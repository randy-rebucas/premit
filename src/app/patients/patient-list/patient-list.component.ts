import { Component, OnInit, OnDestroy, ViewChild, Optional, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { PageEvent, MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { PatientData } from '../patient-data.model';
import { AuthService } from 'src/app/auth/auth.service';
import { PatientsService } from '../patients.service';

import { NotificationService } from 'src/app/shared/notification.service';

import { PatientEditComponent } from '../patient-edit/patient-edit.component';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy {
  patients: PatientData[] = [];
  isLoading = false;
  totalPatients = 0;
  patientsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];
  userIsAuthenticated = false;
  userId: string;
  myDate = new Date();
  theDate: string;

  private patientsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PatientData,
    public patientsService: PatientsService,
    private authService: AuthService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialogService: DialogService
  ) {
    this.theDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['imagePath', 'firstname', 'midlename', 'lastname', 'contact', 'gender', 'birthdate', 'action'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.patientsService.getPatients(this.userId, this.patientsPerPage, this.currentPage);
    this.patientsSub = this.patientsService
      .getPatientUpdateListener()
      .subscribe((patientData: {patients: PatientData[], patientCount: number}) => {
        this.isLoading = false;
        this.totalPatients = patientData.patientCount;
        this.dataSource = new MatTableDataSource(patientData.patients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFilter(patientId) {
    this.router.navigate(['./', patientId], {relativeTo: this.route});
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.patientsPerPage = pageData.pageSize;
    this.patientsService.getPatients(this.userId, this.patientsPerPage, this.currentPage);
  }

  onQue(patientId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
        id: patientId,
        title: 'On Que'
    };
    this.dialog.open(PatientEditComponent, dialogConfig);
  }

  onCreate() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
      id: null,
      title: 'New patient'
    };
    this.dialog.open(PatientEditComponent, dialogConfig);
  }

  onEdit(patientId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
        id: patientId,
        title: 'Update patient'
    };
    this.dialog.open(PatientEditComponent, dialogConfig);
  }

  onDelete(patientId) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        this.patientsService.deletePatient(patientId).subscribe(() => {
          this.patientsService.getPatients(this.userId, this.patientsPerPage, this.currentPage);
          this.notificationService.warn('! Deleted successfully');
        });
      }
    });
  }

  ngOnDestroy() {
    this.patientsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
