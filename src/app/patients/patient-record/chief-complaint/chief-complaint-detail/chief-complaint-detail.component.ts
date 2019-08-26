import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterStateSnapshot } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../auth/auth.service';
import { ComplaintService } from '../../services/complaint.service';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { AssessmentService } from '../../services/assessment.service';
import { PrescriptionService } from '../../services/prescription.service';
import { NotesService } from '../../services/notes.service';
import { AssessmentEditComponent } from '../../assessments/assessment-edit/assetment-edit.component';
import { PrescriptionEditComponent } from '../../prescriptions/prescription-edit/prescription-edit.component';
import { ProgressNoteEditComponent } from '../../progress-notes/progress-note-edit/progress-note-edit.component';
import { ChiefComplaintEditComponent } from '../chief-complaint-edit/chief-complaint-edit.component';
import { RxPadComponent } from 'src/app/rx-pad/rx-pad.component';

@Component({
  selector: 'app-chief-complaint-detail',
  templateUrl: './chief-complaint-detail.component.html',
  styleUrls: ['./chief-complaint-detail.component.css']
})
export class ChiefComplaintDetailComponent implements OnInit, OnDestroy {

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  isLoading = false;

  id: string;
  complaints: any;
  created: string;

  assessmentId: string;
  diagnosis: any;
  treatments: any;

  prescriptionId: string;
  prescriptions: any;

  noteId: string;
  note: string;

  patientId: string;
  targetElem: any;
  targetWidth: any;

  private recordsSub: Subscription;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ComplaintService,
    private dialog: MatDialog,
    private authService: AuthService,
    public route: ActivatedRoute,
    public complaintService: ComplaintService,
    public assessmentService: AssessmentService,
    public prescriptionService: PrescriptionService,
    public notesService: NotesService,
    private router: Router,
    ) {
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

    this.route.paramMap.subscribe(params => {
      this.id = params.get('complaintId');
    });

    /**
     * get complaint
     */
    this.getComplaint(this.id);

    this.recordsSub = this.complaintService
    .getUpdateListener()
    .subscribe(() => {
      this.isLoading = false;
      this.getComplaint(this.id);
    });
    /**
     * get assessment
     */
    this.getAssessement(this.id);

    this.recordsSub = this.assessmentService
    .getUpdateListener()
    .subscribe(() => {
      this.isLoading = false;
      this.getAssessement(this.id);
    });

    /**
     * get prescription
     */
    this.getPrescription(this.id);

    this.recordsSub = this.prescriptionService
    .getUpdateListener()
    .subscribe(() => {
      this.isLoading = false;
      this.getPrescription(this.id);
    });

    /**
     * get progress notes
     */
    this.getProgressNotes(this.id);

    this.recordsSub = this.notesService
    .getUpdateListener()
    .subscribe(() => {
      this.isLoading = false;
      this.getProgressNotes(this.id);
    });
  }

  getComplaint(complaintId) {
    this.complaintService.get(complaintId).subscribe(recordData => {
      this.id = recordData._id;
      this.complaints = recordData.complaints;
      this.created = recordData.created;
    });
  }

  getAssessement(complaintId) {
    this.assessmentService.getByComplaintId(complaintId).subscribe(
      recordData => {
        this.assessmentId = null;
        this.diagnosis = null;
        this.treatments = null;
        if (Object.keys(recordData).length) {
          this.assessmentId = recordData[0]._id;
          this.diagnosis = recordData[0].diagnosis;
          this.treatments = recordData[0].treatments;
        }
      }
    );
  }

  getPrescription(complaintId) {
    this.prescriptionService.getByComplaintId(complaintId).subscribe(
      recordData => {
        this.prescriptionId = null;
        this.prescriptions = null;
        if (Object.keys(recordData).length) {
          this.prescriptionId = recordData[0]._id;
          this.prescriptions = recordData[0].prescriptions;
        }
      }
    );
  }

  getProgressNotes(complaintId) {
    this.notesService.getByComplaintId(complaintId).subscribe(
      recordData => {
        this.noteId = null;
        this.note = null;
        if (Object.keys(recordData).length) {
          this.noteId = recordData[0]._id;
          this.note = recordData[0].note;
        }
      }
    );
  }

  onUpdate(elem, recordId) {
    switch (elem) {
      case 'assessment':
        this.targetElem = AssessmentEditComponent;
        this.targetWidth = '30%';
        break;
      case 'prescription':
        this.targetElem = PrescriptionEditComponent;
        this.targetWidth = '50%';
        break;
      case 'progress-notes':
        this.targetElem = ProgressNoteEditComponent;
        this.targetWidth = '30%';
        break;
      default:
        this.targetElem = ChiefComplaintEditComponent;
        this.targetWidth = '30%';
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = this.targetWidth;
    dialogConfig.data = {
          id: recordId,
          title: 'Update record',
          patient: this.patientId
      };
    this.dialog.open(this.targetElem, dialogConfig);
  }

  onPrintPreview(recordId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
      id: recordId,
      title: 'Print preview',
      patientId: this.patientId
    };
    this.dialog.open(RxPadComponent, dialogConfig);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
