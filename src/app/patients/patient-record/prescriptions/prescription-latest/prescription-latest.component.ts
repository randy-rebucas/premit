import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'app-prescription-latest',
  templateUrl: './prescription-latest.component.html',
  styleUrls: ['./prescription-latest.component.css']
})
export class PrescriptionLatestComponent implements OnInit, OnDestroy {
  createdDate: Date;
  assessmentId: string;
  diagnosis: [];
  treatments: [];
  isLoading = false;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(
    private authService: AuthService,
    public assessmentService: AssessmentService,) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.assessmentService.getLatest().subscribe(
      recordData => {
        this.assessmentId = null;
        this.diagnosis = null;
        this.treatments = null;
        if (Object.keys(recordData).length) {
          this.assessmentId = recordData[0]._id;
          this.createdDate = recordData[0].created;
          this.diagnosis = recordData[0].diagnosis;
          this.treatments = recordData[0].treatments;
        }
      }
    );
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
