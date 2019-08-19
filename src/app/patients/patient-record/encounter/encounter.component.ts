import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';
import { HeightService } from '../services/height.service';
import { WeightService } from '../services/weight.service';
import { TemperatureService } from '../services/temperature.service';
import { BpService } from '../services/bp.service';
import { RprService } from '../services/rpr.service';

@Component({
  selector: 'app-encounter',
  templateUrl: './encounter.component.html',
  styleUrls: ['./encounter.component.css']
})
export class EncounterComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  height: string;
  heightCreatedAt: Date;

  weight: string;
  weightCreatedAt: Date;

  temperature: string;
  temperatureCreatedAt: Date;

  systolic: string;
  diastolic: string;
  bpCreatedAt: Date;

  respiratoryRate: string;
  respiratoryRateCreatedAt: Date;

  constructor(private authService: AuthService,
              private router: Router,
              private notificationService: NotificationService,
              public heightService: HeightService,
              public weightService: WeightService,
              public temperatureService: TemperatureService,
              public bpService: BpService,
              public rprService: RprService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.heightService.getLatest().subscribe(recordData => {
      this.height = null;
      this.heightCreatedAt = null;
      if (Object.keys(recordData).length) {
        this.height = recordData[0].height;
        this.heightCreatedAt = recordData[0].created;
      }
    });

    this.weightService.getLatest().subscribe(recordData => {
      this.weight = null;
      this.weightCreatedAt = null;
      if (Object.keys(recordData).length) {
        this.weight = recordData[0].weight;
        this.weightCreatedAt = recordData[0].created;
      }
    });

    this.temperatureService.getLatest().subscribe(recordData => {
      this.temperature = null;
      this.temperatureCreatedAt = null;
      if (Object.keys(recordData).length) {
        this.temperature = recordData[0].temperature;
        this.temperatureCreatedAt = recordData[0].created;
      }
    });

    this.bpService.getLatest().subscribe(recordData => {
      this.systolic = null;
      this.diastolic = null;
      this.bpCreatedAt = null;
      if (Object.keys(recordData).length) {
        this.systolic = recordData[0].systolic;
        this.diastolic = recordData[0].diastolic;
        this.bpCreatedAt = recordData[0].created;
      }
    });

    this.rprService.getLatest().subscribe(recordData => {
      this.respiratoryRate = null;
      this.respiratoryRateCreatedAt = null;
      if (Object.keys(recordData).length) {
        this.respiratoryRate = recordData[0].respiratoryrate;
        this.respiratoryRateCreatedAt = recordData[0].created;
      }
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
