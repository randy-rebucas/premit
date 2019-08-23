import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { ComplaintService } from '../../services/complaint.service';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { ComplaintData } from '../../models/complaint-data.model';

@Component({
  selector: 'app-chief-complaint-detail',
  templateUrl: './chief-complaint-detail.component.html',
  styleUrls: ['./chief-complaint-detail.component.css']
})
export class ChiefComplaintDetailComponent implements OnInit, OnDestroy {
  complaint: ComplaintData;
  complaints: [];
  id: string;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  isLoading = false;

  private recordsSub: Subscription;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ComplaintService,
    private dialog: MatDialog,
    public route: ActivatedRoute,
    private authService: AuthService,
    public complaintService: ComplaintService,
    private router: Router,
    ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.route.paramMap.subscribe(params => {
      this.id = params.get('complaintId');
      this.complaintService.get(this.id).subscribe(recordData => {
        this.isLoading = false;
        this.complaints = recordData.complaints;
      });
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
