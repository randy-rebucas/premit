import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UploadService } from 'src/app/upload/upload.service';

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

  id: string;
  created: string;
  path: string;
  name: string;
  type: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public uploadService: UploadService
    ) {}

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

  onEdit(id: string) {

  }

  onDelete(id: string) {

  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
