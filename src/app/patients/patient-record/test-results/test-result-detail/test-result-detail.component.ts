import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute, ParamMap, RouterStateSnapshot } from '@angular/router';
import { UploadService } from 'src/app/upload/upload.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-test-result-detail',
  templateUrl: './test-result-detail.component.html',
  styleUrls: ['./test-result-detail.component.css']
})
export class TestResultDetailComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  public recordsSub: Subscription;
  private fileId: string;
  isLoading = false;

  total = 0;
  perPage = 10;
  currentPage = 1;

  id: string;
  created: string;
  path: string;
  name: string;
  type: string;

  patientId: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public uploadService: UploadService,
    private dialogService: DialogService,
    private notificationService: NotificationService
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

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.fileId = paramMap.get('fileId');

      this.uploadService.getFile(this.fileId).subscribe(fileData => {
        this.id = fileData._id;
        this.created = fileData.created;
        this.path = fileData.path;
        this.name = fileData.name;
        this.type = fileData.type;
      });

    });

  }

  onDelete(id: string) {
    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res => {
      if (res) {
        this.uploadService.deleteFile(id).subscribe(() => {
          this.notificationService.warn('! Deleted successfully');
          this.uploadService.getAll(this.perPage, this.currentPage, this.patientId);
          this.router.navigate(['../'], {relativeTo: this.route});
        });
      }
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
