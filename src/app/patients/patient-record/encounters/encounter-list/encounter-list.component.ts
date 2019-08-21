import { Component, OnInit, OnDestroy, Optional, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute, Params, ParamMap, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

import { MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, MatDialogConfig } from '@angular/material';
import { DatePipe } from '@angular/common';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-encounter-list',
  templateUrl: './encounter-list.component.html',
  styleUrls: ['./encounter-list.component.css']
})
export class EncounterListComponent implements OnInit, OnDestroy {

  private recordsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(
    // @Optional() @Inject(MAT_DIALOG_DATA) public data: HistoryService,
    
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialogService: DialogService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService) {
      const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
      const splitUrl = snapshot.url.split('/');
    //   this.patientId = splitUrl[2];
    }

    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['type', 'description', 'created', 'action'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    
  }

  
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
