import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../../environments/environment';
import { HeightData } from '../models/height-data.model';

const BACKEND_URL = environment.apiUrl + '/heights';

@Injectable({providedIn: 'root'})

export class HeightService {
  private heights: HeightData[] = [];
  private heightsUpdated = new Subject<{ heights: HeightData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patient=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, heights: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(hieghtData => {
        return { heights: hieghtData.heights.map(height => {
          return {
            id: height._id,
            height: height.height,
            created: height.created
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
    return this.http.get<{ _id: string; height: string, created: string, patient: string }>(
      BACKEND_URL + '/' + id
      );
  }

  insert(height: string, created: string, patient: string) {

    const recordData = {
      height, created, patient
    };
    console.log(recordData);
    return this.http.post<{ message: string, record: HeightData }>(BACKEND_URL, recordData);
  }

  update(id: string, height: string, created: string, patient: string) {
    let recordData: HeightData | FormData;
    recordData = {
        id, height, created, patient
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(patientId: string) {
    return this.http.delete(BACKEND_URL + '/' + patientId);
  }

}
