import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { ComplaintService } from '../../services/complaint.service';

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

  constructor(public route: ActivatedRoute,
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
      this.complaintId = recordData[0]._id;
      this.createdDate = recordData[0].created;
      this.complaints = recordData[0].complaints;
    });
  }

  onCreate() {

  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
