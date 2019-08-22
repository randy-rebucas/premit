import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../../environments/environment';
import { TemperatureData } from '../models/temperature-data.model';

const BACKEND_URL = environment.apiUrl + '/temperatures';

@Injectable({providedIn: 'root'})

export class TemperatureService {
  private temperatures: TemperatureData[] = [];
  private temperaturesUpdated = new Subject<{ temperatures: TemperatureData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

    getAll(perPage: number, currentPage: number, patientId: string) {
      const queryParams = `?patient=${patientId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, temperatures: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(temperatureData => {
          return { temperatures: temperatureData.temperatures.map(temperature => {
            return {
              id: temperature._id,
              temperature: temperature.temperature,
              created: temperature.created
            };
          }), max: temperatureData.max};
        })
      )
      .subscribe((transformData) => {
        this.temperatures = transformData.temperatures;
        this.temperaturesUpdated.next({
            temperatures: [...this.temperatures],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.temperaturesUpdated.asObservable();
  }

  get(id: string) {
    return this.http.get<{ _id: string; temperature: string, created: string, patient: string }>(
      BACKEND_URL + '/' + id
      );
  }

  getLatest(patientId) {
    return this.http.get<{ _id: string; temperature: string, created: string, patient: string }>(
      BACKEND_URL + '/latest/' + patientId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string; temperature: string, created: string, patient: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(temperature: string, created: string, patient: string) {
    const recordData = {
        temperature, created, patient
    };
    return this.http.post<{ message: string, record: TemperatureData }>(BACKEND_URL, recordData);
  }

  update(id: string, temperature: string, created: string, patient: string) {
    let recordData: TemperatureData | FormData;
    recordData = {
        id, temperature, created, patient
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }

}
