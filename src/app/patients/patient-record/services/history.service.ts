import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../../environments/environment';
import { HistoryData } from '../models/history-data.model';

const BACKEND_URL = environment.apiUrl + '/histories';

@Injectable({providedIn: 'root'})

export class HistoryService {
  private histories: HistoryData[] = [];
  private historiesUpdated = new Subject<{ histories: HistoryData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patient=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, histories: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(historyData => {
        return { histories: historyData.histories.map(history => {
          return {
            id: history._id,
            type: history.type,
            description: history.description,
            created: history.created
          };
        }), max: historyData.max};
      })
    )
    .subscribe((transformData) => {
      this.histories = transformData.histories;
      this.historiesUpdated.next({
        histories: [...this.histories],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.historiesUpdated.asObservable();
  }

  get(id: string) {
    return this.http.get<{ _id: string; type: string, description: string, created: string, patient: string }>(
      BACKEND_URL + '/' + id
      );
  }

  insert(type: string, description: string, created: string, patient: string) {
    const recordData = {
      type, description, created, patient
    };
    return this.http.post<{ message: string, record: HistoryData }>(BACKEND_URL, recordData);
  }

  update(id: string, type: string, description: string, created: string, patient: string) {
    let recordData: HistoryData | FormData;
    recordData = {
        id, type, description, created, patient
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }

}
