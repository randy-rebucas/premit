import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { PatientsService } from '../patients.service';
import { PatientData } from '../patient-data.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css']
})
export class PatientEditComponent implements OnInit, OnDestroy {
  patientsPerPage = 10;
  currentPage = 1;

  patient: PatientData;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private patientId: string;
  private title: string;
  private authStatusSub: Subscription;

  startDate = new Date(1990, 0, 1);

  constructor(
    public patientsService: PatientsService,
    public route: ActivatedRoute,
    private authService: AuthService,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < PatientEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.patientId = data.id;
    this.title = data.title;
    console.log(data.id);
  }

  ngOnInit() {
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      // id: new FormControl(null),
      firstname: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50) ]
      }),
      midlename: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastname: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      }),
      contact: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(7), Validators.maxLength(13)]
      }),
      gender: new FormControl(null, {
        validators: [Validators.required]
      }),
      birthdate: new FormControl(null),
      address: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(250)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    
    if (this.patientId) {
        this.mode = 'edit';
        // this.patientId = paramMap.get('patientId');
        this.isLoading = true;
        this.patientsService.getPatient(this.patientId).subscribe(patientData => {
          this.isLoading = false;
          this.patient = {
            id: patientData._id,
            firstname: patientData.firstname,
            midlename: patientData.midlename,
            lastname: patientData.lastname,
            contact: patientData.contact,
            gender: patientData.gender,
            birthdate: patientData.birthdate,
            address: patientData.address,
            imagePath: patientData.imagePath,
            creator: patientData.creator
          };
          this.form.setValue({
            firstname: this.patient.firstname,
            midlename: this.patient.midlename,
            lastname: this.patient.lastname,
            contact: this.patient.contact,
            gender: this.patient.gender,
            birthdate: this.patient.birthdate,
            address: this.patient.address,
            image: this.patient.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.patientId = null;
      }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePatient() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.patientsService.addPatient(
        this.form.value.firstname,
        this.form.value.midlename,
        this.form.value.lastname,
        this.form.value.contact,
        this.form.value.gender,
        this.form.value.birthdate,
        this.form.value.address,
        this.form.value.image
      ).subscribe(() => {
        this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
      });

      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.onClose();
    } else {
      this.patientsService.updatePatient(
        this.patientId,
        this.form.value.firstname,
        this.form.value.midlename,
        this.form.value.lastname,
        this.form.value.contact,
        this.form.value.gender,
        this.form.value.birthdate,
        this.form.value.address,
        this.form.value.image
      ).subscribe(() => {
        this.patientsService.getPatients(this.patientsPerPage, this.currentPage);
      });

      this.form.reset();
      this.notificationService.success(':: Updated successfully');
      this.onClose();
    }
  }

  onClose() {
    this.form.reset();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
