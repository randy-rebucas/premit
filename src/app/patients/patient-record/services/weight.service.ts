import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../../environments/environment';
import { WeightData } from '../models/weight-data.model';

const BACKEND_URL = environment.apiUrl + '/weights';

@Injectable({providedIn: 'root'})

export class WeightService {
  private weights: WeightData[] = [];
  private weightsUpdated = new Subject<{ weights: WeightData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

    getAll(perPage: number, currentPage: number, patientId: string) {
      const queryParams = `?patient=${patientId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, weights: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(weightData => {
          return { weights: weightData.weights.map(weight => {
            return {
              id: weight._id,
              weight: weight.weight,
              created: weight.created
            };
          }), max: weightData.max};
        })
      )
      .subscribe((transformData) => {
        this.weights = transformData.weights;
        this.weightsUpdated.next({
          weights: [...this.weights],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.weightsUpdated.asObservable();
  }

  get(id: string) {
    return this.http.get<{ _id: string; weight: string, created: string, patient: string }>(
      BACKEND_URL + '/' + id
      );
  }

  getLatest(patientId) {
    return this.http.get<{ _id: string; weight: string, created: string, patient: string }>(
      BACKEND_URL + '/latest/' + patientId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string; weight: string, created: string, patient: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(weight: string, created: string, patient: string) {
    const recordData = {
      weight, created, patient
    };
    return this.http.post<{ message: string, record: WeightData }>(BACKEND_URL, recordData);
  }

  update(id: string, weight: string, created: string, patient: string) {
    let recordData: WeightData | FormData;
    recordData = {
        id, weight, created, patient
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }

}
