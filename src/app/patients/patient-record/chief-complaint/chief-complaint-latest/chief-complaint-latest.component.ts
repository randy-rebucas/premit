import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { ComplaintService } from '../../services/complaint.service';
import { AssessmentEditComponent } from '../../assessments/assessment-edit/assetment-edit.component';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { ComplaintData } from '../../models/complaint-data.model';

@Component({
  selector: 'app-chief-complaint-latest',
  templateUrl: './chief-complaint-latest.component.html',
  styleUrls: ['./chief-complaint-latest.component.css']
})
export class ChiefComplaintLatestComponent implements OnInit, OnDestroy {
  complaints: [];
  createdDate: string;
  complaintId: string;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  isLoading = false;
  private mode = 'create';
  private recordId: string;
  patientId: string;
  title: string;
  form: FormGroup;
  count: number;

  private recordsSub: Subscription;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ComplaintService,
    private dialog: MatDialog,
    public route: ActivatedRoute,
    private authService: AuthService,
    public complaintService: ComplaintService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.complaintService.getLatest().subscribe(recordData => {
        this.complaintId = null;
        this.createdDate = null;
        this.complaints = null;
        if (Object.keys(recordData).length) {
          this.complaintId = recordData[0]._id;
          this.createdDate = recordData[0].created;
          this.complaints = recordData[0].complaints;
        }
      });

    this.recordsSub = this.complaintService
      .getUpdateListener()
      .subscribe((complaintData: {complaints: ComplaintData[], count: number}) => {
        this.isLoading = false;
        this.complaintService.getLatest().subscribe(recordData => {
          this.complaintId = null;
          this.createdDate = null;
          this.complaints = null;
          if (Object.keys(recordData).length) {
            this.complaintId = recordData[0]._id;
            this.createdDate = recordData[0].created;
            this.complaints = recordData[0].complaints;
          }
          this.count = complaintData.count;
        });
      });
    }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
