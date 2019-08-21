import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { PatientData } from '../patient-data.model';
import { PatientsService } from '../patients.service';

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

  patient: PatientData;
  private patientId: string;

  constructor(
    private authService: AuthService,
    public patientsService: PatientsService,
    private route: ActivatedRoute,
    private router: Router
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
        this.patientsService.getPatient(this.patientId).subscribe(patientData => {
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
            client: patientData.client_id
          };
          this.id = this.patient.id;
          this.firstname = this.patient.firstname;
          this.midlename = this.patient.midlename;
          this.lastname = this.patient.lastname;
          this.fullname = this.firstname.concat( ' ' + this.midlename + ' ' + this.lastname );
          this.contact = this.patient.contact;
          this.gender = this.patient.gender;
          this.birthdate = this.patient.birthdate;
          this.image = this.patient.imagePath;
        });
      });
    }

    ngOnDestroy() {
      this.authListenerSubs.unsubscribe();
    }
}
