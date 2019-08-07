import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../environments/environment';
import { PatientRecordHeight } from './patient-record-height.model';

const BACKEND_URL = environment.apiUrl + '/patients';

@Injectable({providedIn: 'root'})

export class PatientsRecordService {
  private heights: PatientRecordHeight[] = [];
  private heightsUpdated = new Subject<{ heights: PatientRecordHeight[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

  getAll(perPage: number, currentPage: number) {
    const queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, heights: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(hieghtData => {
        return { heights: hieghtData.heights.map(height => {
          return {
            id: height._id,
            height: height.height,
            created: height.created,
            patient: height.patient
          };
        }), max: hieghtData.max};
      })
    )
    .subscribe((transformData) => {
      this.heights = transformData.heights;
      this.heightsUpdated.next({
        heights: [...this.heights],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.heightsUpdated.asObservable();
  }

  get(id: string) {
    return this.http.get<{ _id: string; height: string, created: string, patient: string
    }>(
      BACKEND_URL + '/' + id
      );
  }

  add(height: string, created: string, patient: string
    ) {
    const recordData = new FormData();
    recordData.append('height', height);
    recordData.append('created', created === '' ? '' : this.datePipe.transform(created, 'yyyy-MM-dd'));
    recordData.append('patient', patient);
    return this.http.post<{ message: string, record: PatientRecordHeight }>(BACKEND_URL, recordData);
  }

  update(id: string, height: string, created: string, patient: string) {
    let recordData: PatientRecordHeight | FormData;
    recordData = {
        id, height, created, patient
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(patientId: string) {
    return this.http.delete(BACKEND_URL + '/' + patientId);
  }

}
