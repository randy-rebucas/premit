import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../environments/environment';
import { SettingsData } from './settings-data.model';

const BACKEND_URL = environment.apiUrl + '/service';

@Injectable({providedIn: 'root'})

export class SettingsService {
  private settings: SettingsData[] = [];
  // private prescriptions: PrescriptionData[] = [];
  private settingsUpdated = new Subject<{ settings: SettingsData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

    getAll(perPage: number, currentPage: number) {
      const queryParams = `?pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, settings: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(settingData => {
          return { settings: settingData.settings.map(setting => {
            return {
              id: setting._id,
              clinic_name: setting.clinic_name,
              clinic_address: setting.clinic_address,
              clinic_url: setting.clinic_url,
              clinic_phone: setting.clinic_phone,
              clinic_hours: setting.clinic_hours
            };
          }), max: settingData.max};
        })
      )
      .subscribe((transformData) => {
        this.settings = transformData.settings;
        this.settingsUpdated.next({
          settings: [...this.settings],
          count: transformData.max
        });
      });
    }
  
    getUpdateListener() {
      return this.settingsUpdated.asObservable();
    }
  
    get(id: string) {
      return this.http.get<{ _id: string; name: string, address: string, url: string, phones: [], hours: []}>(
        BACKEND_URL + '/' + id
        );
    }
  
    insert(name: string, address: string, url: string, phones: [], hours: []) {
      const recordData = {
        name, address, url, phones, hours
      };
      return this.http.post<{ message: string, record: SettingsData }>(BACKEND_URL, recordData);
    }
  
    delete(recordId: string) {
      return this.http.delete(BACKEND_URL + '/' + recordId);
    }
}
