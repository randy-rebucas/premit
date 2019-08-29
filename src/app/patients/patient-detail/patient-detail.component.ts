import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params, ParamMap } from '@angular/router';
import { PatientsService } from '../patients.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { HeightService } from '../patient-record/services/height.service';
import { WeightService } from '../patient-record/services/weight.service';
import { TemperatureService } from '../patient-record/services/temperature.service';
import { BpService } from '../patient-record/services/bp.service';
import { RprService } from '../patient-record/services/rpr.service';
import { HistoryService } from '../patient-record/services/history.service';
import { ComplaintService } from '../patient-record/services/complaint.service';
import { AssessmentService } from '../patient-record/services/assessment.service';
import { PrescriptionService } from '../patient-record/services/prescription.service';
import { NotesService } from '../patient-record/services/notes.service';
import { QrCodeGenerateComponent } from 'src/app/qr-code/qr-code-generate/qr-code-generate.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { PatientChartComponent } from '../patient-chart/patient-chart.component';
import { MessageEditComponent } from 'src/app/messages/message-edit/message-edit.component';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  id: string;
  image: string;
  firstname: string;
  midlename: string;
  lastname: string;
  contact: string;
  gender: string;
  birthdate: string;

  height: number;
  heightCreated = new Date();

  weight: number;
  weightCreated = new Date();

  temperature: number;
  temperatureCreated = new Date();

  tempSystolic: number;
  tempDiastolic: number;
  tempCreated = new Date();

  respiratoryRate: number;
  respiratoryRateCreated = new Date();

  histories: any;
  complaints: any;
  assessments: any;
  diagnosis: any;
  treatments: any;
  prescriptions: any;
  progressNotes: string;

  private patientId: string;
  private recordsSub: Subscription;
  constructor(
    private authService: AuthService,
    public patientsService: PatientsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public heightService: HeightService,
    public weightService: WeightService,
    public temperatureService: TemperatureService,
    public bpService: BpService,
    public rprService: RprService,
    public historyService: HistoryService,
    public complaintService: ComplaintService,
    public assessmentService: AssessmentService,
    public prescriptionService: PrescriptionService,
    public notesService: NotesService
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
        this.image = patientData.imagePath;
      });

      this.heightService.getLast(this.patientId).subscribe(recordData => {
        this.height = recordData[0].height;
        this.heightCreated = recordData[0].created;
      });

      this.weightService.getLast(this.patientId).subscribe(recordData => {
        this.weight = recordData[0].weight;
        this.weightCreated = recordData[0].created;
      });

      this.temperatureService.getLast(this.patientId).subscribe(recordData => {
        this.temperature = recordData[0].temperature;
        this.temperatureCreated = recordData[0].created;
      });

      this.bpService.getLast(this.patientId).subscribe(recordData => {
        this.tempSystolic = recordData[0].systolic;
        this.tempDiastolic = recordData[0].diastolic;
        this.tempCreated = recordData[0].created;
      });

      this.rprService.getLast(this.patientId).subscribe(recordData => {
        this.respiratoryRate = recordData[0].respiratoryrate;
        this.respiratoryRateCreated = recordData[0].created;
      });

      this.historyService.getLast(this.patientId).subscribe(recordData => {
        this.histories = recordData;
      });

      this.complaintService.getLast(this.patientId).subscribe(recordData => {
        this.complaints = null;
        if (Object.keys(recordData).length) {
          this.complaints = recordData[0].complaints;
        }
      });

      this.assessmentService.getLast(this.patientId).subscribe(recordData => {
        this.diagnosis = null;
        this.treatments = null;
        if (Object.keys(recordData).length) {
          this.diagnosis = recordData[0].diagnosis;
          this.treatments = recordData[0].treatments;
        }
      });

      this.prescriptionService.getLast(this.patientId).subscribe(recordData => {
        this.prescriptions = null;
        if (Object.keys(recordData).length) {
          this.prescriptions = recordData[0].prescriptions;
        }
      });

      this.notesService.getLast(this.patientId).subscribe(recordData => {
        this.progressNotes = null;
        if (Object.keys(recordData).length) {
          this.progressNotes = recordData[0].notes;
        }
      });
    }

    onViewAll(targetComp: any) {
      switch (targetComp) {
        case 'height':
          this.router.navigate(['./record/physical-exams/height'], {relativeTo: this.route});
          break;
        case 'weight':
          this.router.navigate(['./record/physical-exams/weight'], {relativeTo: this.route});
          break;
        case 'temperature':
          this.router.navigate(['./record/physical-exams/temperature'], {relativeTo: this.route});
          break;
        case 'blood-pressure':
          this.router.navigate(['./record/physical-exams/blood-pressure'], {relativeTo: this.route});
          break;
        case 'respiratory-rate':
          this.router.navigate(['./record/physical-exams/respiratory-rate'], {relativeTo: this.route});
          break;
        case 'histories':
          this.router.navigate(['./record/histories'], {relativeTo: this.route});
          break;
        case 'chief-complaints':
          this.router.navigate(['./record/chief-complaints'], {relativeTo: this.route});
          break;
        case 'assessments':
          this.router.navigate(['./record/assessments'], {relativeTo: this.route});
          break;
        case 'prescriptions':
          this.router.navigate(['./record/prescriptions'], {relativeTo: this.route});
          break;
        case 'progress-notes':
          this.router.navigate(['./record/progress-notes'], {relativeTo: this.route});
          break;
        case 'test-results':
          this.router.navigate(['./record/test-results'], {relativeTo: this.route});
          break;
        default:
          this.router.navigate(['./'], {relativeTo: this.route});
      }
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
