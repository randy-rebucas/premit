import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
import { PatientsService } from '../patients.service';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-patient-chart',
  templateUrl: './patient-chart.component.html',
  styleUrls: ['./patient-chart.component.css']
})
export class PatientChartComponent implements OnInit, OnDestroy {
    @ViewChild('content', {static: false}) content: ElementRef;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  id: string;
  image: string;
  firstname: string;
  midlename: string;
  lastname: string;
  contact: string;
  gender: string;
  address: string;
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

  patientId: string;
  title: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public patientsService: PatientsService,
    public heightService: HeightService,
    public weightService: WeightService,
    public temperatureService: TemperatureService,
    public bpService: BpService,
    public rprService: RprService,
    public historyService: HistoryService,
    public complaintService: ComplaintService,
    public assessmentService: AssessmentService,
    public prescriptionService: PrescriptionService,
    public notesService: NotesService,
    public dialogRef: MatDialogRef < PatientChartComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      this.title = data.title;
      this.patientId = data.patientId; // 'Your QR code data string';
     }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.patientsService.getPatient(this.patientId).subscribe(patientData => {
        this.id = patientData._id;
        this.firstname = patientData.firstname;
        this.midlename = patientData.midlename;
        this.lastname = patientData.lastname;
        this.contact = patientData.contact;
        this.gender = patientData.gender;
        this.birthdate = patientData.birthdate;
        this.address = patientData.address;
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
          this.progressNotes = recordData[0].note;
        }
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  public downloadChart() {

    const content = this.content.nativeElement;

    html2canvas(content).then(canvas => {

      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/jpg');

      const pdfDoc = new jsPDF();

      const margins = {
          top: 15,
          bottom: 15,
          left: 15,
          width: 190
      };

      const position = 0;

      const specialElementHandlers = {
          '#editor': function(element: any, renderer: any) {
              return true;
          }
      };

      pdfDoc.fromHTML(content.innerHTML, margins.left, margins.top, {
          'width': margins.width,
          'elementHandlers': specialElementHandlers
      });

      pdfDoc.setProperties({
        title: 'Record Chart',
        subject: 'Randy Rebucas Record Chart',
        author: 'Clinic+',
        keywords: 'patient chart',
        creator: 'Clinic+'
      });

      pdfDoc.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      pdfDoc.save('record.pdf');
    });
  }

  // getImgFromUrl(logoUrl, callback) {
  //   const img = new Image();
  //   img.src = logoUrl;
  //   img.onload = function() {
  //       callback(img);
  //   };
  // }

  // generatePDF(img) {
  //   const options = {orientation: 'p', unit: 'mm', format: 'a4'};
  //   const doc = new jsPDF(options);
  //   doc.addImage(img, 'JPEG', 0, 0, 100, 50);
  //   doc.save('record.pdf');
  // }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
