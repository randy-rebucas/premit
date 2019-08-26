import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PrescriptionService } from '../patients/patient-record/services/prescription.service';
import { PrescriptionData } from '../patients/patient-record/models/prescription-data.model';

@Component({
  selector: 'app-rx-pad',
  templateUrl: './rx-pad.component.html',
  styleUrls: ['./rx-pad.component.css']
})
export class RxPadComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  recordId: string;
  patientId: string;
  title: string;

  id: string;
  created: string;
  complaintId: string;
  prescription: any;

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    public prescriptionService: PrescriptionService,
    public dialogRef: MatDialogRef < RxPadComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      this.recordId = data.id;
      this.patientId = data.patientId;
      this.title = data.title;
    }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.isLoading = true;
    this.prescriptionService.get(this.recordId).subscribe(recordData => {
      this.isLoading = false;
      this.id = recordData._id;
      this.created = recordData.created;
      this.complaintId = recordData.complaint;
      this.prescription = recordData.prescriptions;
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
