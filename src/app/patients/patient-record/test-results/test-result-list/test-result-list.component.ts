import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { UploadService } from 'src/app/upload/upload.service';
import { UploadData } from 'src/app/upload/upload-data.model';

@Component({
  selector: 'app-test-result-list',
  templateUrl: './test-result-list.component.html',
  styleUrls: ['./test-result-list.component.css']
})
export class TestResultListComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private recordsSub: Subscription;
  private authListenerSubs: Subscription;

  files: UploadData[] = [];
  isLoading = false;
  total = 0;
  perPage = 10;
  currentPage = 1;

  patientId: string;

  pageSizeOptions = [5, 10, 25, 100];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public uploadService: UploadService
    ) {
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
