import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PrescriptionService } from '../patients/patient-record/services/prescription.service';
import { PrescriptionData } from '../patients/patient-record/models/prescription-data.model';
import { PatientsService } from '../patients/patients.service';

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
  canClosed: boolean;

  id: string;
  created: string;
  complaintId: string;
  prescriptions: any;

  image: string;
  firstname: string;
  midlename: string;
  lastname: string;
  contact: string;
  gender: string;
  birthdate: string;
  address: string;

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    public prescriptionService: PrescriptionService,
    public patientsService: PatientsService,
    public dialogRef: MatDialogRef < RxPadComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      this.recordId = data.id;
      this.patientId = data.patientId;
      this.title = data.title;
      this.canClosed = data.canClose ? true : false;
    }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.isLoading = true;

    this.patientsService.getPatient(this.patientId).subscribe(patientData => {
      this.firstname = patientData.firstname;
      this.midlename = patientData.midlename;
      this.lastname = patientData.lastname;
      this.contact = patientData.contact;
      this.gender = patientData.gender;
      this.birthdate = patientData.birthdate;
      this.address = patientData.address;
    });

    this.prescriptionService.get(this.recordId).subscribe(recordData => {
      this.isLoading = false;
      this.id = recordData._id;
      this.created = recordData.created;
      this.complaintId = recordData.complaint;
      this.prescriptions = recordData.prescriptions;
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
