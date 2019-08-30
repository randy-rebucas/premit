import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { UploadService } from 'src/app/upload/upload.service';
import { UploadData } from 'src/app/upload/upload-data.model';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.css']
})
export class TestResultsComponent implements OnInit, OnDestroy {
  files: UploadData[] = [];
  isLoading = false;
  total = 0;
  perPage = 10;
  currentPage = 1;

  patientId: string;

  pageSizeOptions = [5, 10, 25, 100];
  userIsAuthenticated = false;
  private recordsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private notificationService: NotificationService,
              public uploadService: UploadService) {
                const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
                const splitUrl = snapshot.url.split('/');
                this.patientId = splitUrl[2];
              }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.uploadService.getAll(this.perPage, this.currentPage, this.patientId);

    this.recordsSub = this.uploadService
      .getUpdateListener()
      .subscribe((fileData: {files: UploadData[], count: number}) => {
        this.isLoading = false;
        this.total = fileData.count;
        this.files = fileData.files;
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
