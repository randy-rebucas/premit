import { Injectable, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { AppSettings } from './appsettings';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

const BACKEND_URL = environment.apiUrl + '/setting';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService implements OnInit {
  private appConfig;
  private clientId: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.clientId = this.authService.getUserId();
  }

  // tslint:disable-next-line:contextual-lifecycle
  ngOnInit() {
    this.loadAppConfig(this.clientId);
  }

  getSettings(): Observable<AppSettings> {
    const settings = new AppSettings();
    return of<AppSettings>(settings);
  }

  loadAppConfig(clientId: string) {
    //'/assets/data/appConfig.json'
    return this.http.get(BACKEND_URL + '/' + clientId).subscribe(settingData => {
        this.appConfig = settingData;
      });
  }

  getConfig() {
    console.log(this.appConfig);
    return this.appConfig;
  }
}
