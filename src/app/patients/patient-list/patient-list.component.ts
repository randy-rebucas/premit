import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { PatientData } from '../patient-data.model';
import { AuthService } from 'src/app/auth/auth.service';
import { PatientsService } from '../patients.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

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
  private patientsSub: Subscription;
  private authStatusSub: Subscription;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public patientsService: PatientsService,
    private authService: AuthService,
  ) {}

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['firstname', 'midlename', 'lastname', 'contact', 'gender', 'action'];

  ngOnInit() {
    this.isLoading = true;
    this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
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

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.patientsPerPage = pageData.pageSize;
    this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.patientsService.deletePatient(postId).subscribe(() => {
      this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.patientsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
