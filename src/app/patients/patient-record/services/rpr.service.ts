import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../../environments/environment';
import { RprData } from '../models/rpr-data.model';

const BACKEND_URL = environment.apiUrl + '/respiratory-rate';

@Injectable({providedIn: 'root'})

export class RprService {
  private rprs: RprData[] = [];
  private rprsUpdated = new Subject<{ rprs: RprData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patient=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, rprs: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(rprData => {
        console.log(rprData);
        return { rprs: rprData.rprs.map(rpr => {
          return {
            id: rpr._id,
            respiratoryrate: rpr.respiratoryrate,
            created: rpr.created
          };
        }), max: rprData.max};
      })
    )
    .subscribe((transformData) => {
      this.rprs = transformData.rprs;
      this.rprsUpdated.next({
        rprs: [...this.rprs],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.rprsUpdated.asObservable();
  }

  get(id: string) {
    return this.http.get<{ _id: string; respiratoryrate: string, created: string, patient: string }>(
      BACKEND_URL + '/' + id
      );
  }

  getLatest(patientId) {
    return this.http.get<{ _id: string; respiratoryrate: string, created: string, patient: string }>(
      BACKEND_URL + '/latest/' + patientId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string; respiratoryrate: string, created: string, patient: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(respiratoryrate: string, created: string, patient: string) {
    const recordData = {
      respiratoryrate, created, patient
    };
    return this.http.post<{ message: string, record: RprData }>(BACKEND_URL, recordData);
  }

  update(id: string, respiratoryrate: string, created: string, patient: string) {
    let recordData: RprData | FormData;
    recordData = {
        id, respiratoryrate, created, patient
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }

}
