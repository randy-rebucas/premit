import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../environments/environment';
import { SettingsData } from './settings-data.model';

const BACKEND_URL = environment.apiUrl + '/patients';

@Injectable({providedIn: 'root'})

export class SettingsService {
  private settings: SettingsData[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}
}
