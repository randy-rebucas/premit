import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params, ParamMap } from '@angular/router';
import { PatientsService } from '../patients.service';
import { PatientData } from '../patient-data.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { HeightService } from '../patient-record/services/height.service';
import { WeightService } from '../patient-record/services/weight.service';
import { TemperatureService } from '../patient-record/services/temperature.service';
import { BpService } from '../patient-record/services/bp.service';
import { RprService } from '../patient-record/services/rpr.service';

// import { HeightData } from '../patient-record/models/height-data.model';
@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  perPage = 10;
  currentPage = 1;

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

  systolic: number;
  diastolic: number;
  bpCreated = new Date();

  rpr: number;
  rprCreated = new Date();

  private patientId: string;
  private recordsSub: Subscription;
  constructor(
    private authService: AuthService,
    public patientsService: PatientsService,
    private route: ActivatedRoute,
    private router: Router,
    public heightService: HeightService,
    public weightService: WeightService,
    public temperatureService: TemperatureService,
    public bpService: BpService,
    public rprService: RprService
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
        this.systolic = recordData[0].systolic;
        this.diastolic = recordData[0].diastolic;
        this.bpCreated = recordData[0].created;
      });

      this.rprService.getLast(this.patientId).subscribe(recordData => {
        this.rpr = recordData[0].respiratoryrate;
        this.rprCreated = recordData[0].created;
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

    ngOnDestroy() {
      this.authListenerSubs.unsubscribe();
    }
}
