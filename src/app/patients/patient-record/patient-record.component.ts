import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PatientsService } from '../patients.service';
import { QrCodeGenerateComponent } from 'src/app/qr-code/qr-code-generate/qr-code-generate.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { PatientChartComponent } from '../patient-chart/patient-chart.component';
import { MessageEditComponent } from 'src/app/messages/message-edit/message-edit.component';

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styleUrls: ['./patient-record.component.css']
})
export class PatientRecordComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  id: string;
  firstname: string;
  midlename: string;
  lastname: string;
  fullname: string;
  contact: string;
  gender: string;
  birthdate: string;
  image: string;

  private patientId: string;

  constructor(
    private authService: AuthService,
    public patientsService: PatientsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
    ) { }

    ngOnInit() {
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.patientId = paramMap.get('patientId');
      });

      this.patientsService.getPatient(this.patientId).subscribe(patientData => {
        this.id = patientData._id;
        this.firstname = patientData.firstname;
        this.midlename = patientData.midlename;
        this.lastname = patientData.lastname;
        this.contact = patientData.contact;
        this.gender = patientData.gender;
        this.birthdate = patientData.birthdate;
      });
    }

    generateQrCode() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '16%';
      dialogConfig.data = {
        id: null,
        title: 'Generate QR Code',
        patientId: this.patientId
      };
      this.dialog.open(QrCodeGenerateComponent, dialogConfig);
  }

  viewChart() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
        id: null,
        title: 'Chart',
        patientId: this.patientId
      };
    this.dialog.open(PatientChartComponent, dialogConfig);
  }

  onCreateMessage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.data = {
        id: null,
        title: 'Create Message',
        patientId: this.patientId
      };
    this.dialog.open(MessageEditComponent, dialogConfig);
  }

    ngOnDestroy() {
      this.authListenerSubs.unsubscribe();
    }
}
