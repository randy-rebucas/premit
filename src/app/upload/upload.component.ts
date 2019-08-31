import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import { UploadService } from './upload.service';
import { UploadData } from './upload-data.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnDestroy {
  @Input() complaintId: string;
  isLoading = false;
  total = 0;
  perPage = 10;
  currentPage = 1;

  pageSizeOptions = [5, 10, 25, 100];

  patientId: string;
  attachmentId: string;
  attachments: any;

  form: FormGroup;
  imagePreview: string;
  userIsAuthenticated = false;
  private recordsSub: Subscription;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              public dialog: MatDialog,
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

    // this.uploadService.getAll(this.perPage, this.currentPage, this.patientId);

    this.uploadService.getByComplaintId(this.complaintId).subscribe(
      recordData => {
        if (Object.keys(recordData).length) {
          this.attachments = recordData;
        }
      }
    );

    this.recordsSub = this.uploadService
      .getUpdateListener()
      .subscribe((fileData: {files: UploadData[], count: number}) => {
        this.isLoading = false;
        this.total = fileData.count;
        this.attachments = fileData.files;
    });
  }

  openUploadDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.height = '50%';
    dialogConfig.data = {
      title: 'Upload Files',
      patient: this.patientId,
      complaint: this.complaintId
    };
    this.dialog.open(DialogComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
