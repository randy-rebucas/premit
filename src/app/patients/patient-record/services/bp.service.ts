import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../../environments/environment';
import { BpData } from '../models/bp-data.model';

const BACKEND_URL = environment.apiUrl + '/bps';

@Injectable({providedIn: 'root'})

export class BpService {
  private bps: BpData[] = [];
  private bpsUpdated = new Subject<{ bps: BpData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patient=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, bps: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(bpData => {
        console.log(bpData);
        return { bps: bpData.bps.map(bp => {
          return {
            id: bp._id,
            systolic: bp.systolic,
            diastolic: bp.diastolic,
            heartrate: bp.heartrate,
            created: bp.created
          };
        }), max: bpData.max};
      })
    )
    .subscribe((transformData) => {
      this.bps = transformData.bps;
      this.bpsUpdated.next({
        bps: [...this.bps],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.bpsUpdated.asObservable();
  }

  get(id: string) {
    return this.http.get<{ _id: string; systolic: string, diastolic: string, heartrate: string, created: string, patient: string }>(
      BACKEND_URL + '/' + id
      );
  }

  insert(systolic: string, diastolic: string, heartrate: string, created: string, patient: string) {
    const recordData = {
        systolic, diastolic, heartrate, created, patient
    };
    return this.http.post<{ message: string, record: BpData }>(BACKEND_URL, recordData);
  }

  update(id: string, systolic: string, diastolic: string, heartrate: string, created: string, patient: string) {
    let recordData: BpData | FormData;
    recordData = {
        id, systolic, diastolic, heartrate, created, patient
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }

}
