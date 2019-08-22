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

import { HeightData } from '../patient-record/models/height-data.model';
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
  image: string;
  
  height: string;
  heights: any;
  info: any;
  patient: PatientData;
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
        this.info = patientData;
        this.image = patientData.imagePath;
        console.log(patientData.imagePath);
      });

      this.heightService.getLast(this.patientId).subscribe(recordData => {
        console.log(recordData);
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
