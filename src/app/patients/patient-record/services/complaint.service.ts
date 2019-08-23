import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../../environments/environment';
import { ComplaintData } from '../models/complaint-data.model';

const BACKEND_URL = environment.apiUrl + '/chief-complaints';

@Injectable({providedIn: 'root'})

export class ComplaintService {
  private complaints: ComplaintData[] = [];
  private complaintsUpdated = new Subject<{ complaints: ComplaintData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patient=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, complaints: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(complaintData => {
        return { complaints: complaintData.complaints.map(complaint => {
          return {
            id: complaint._id,
            complaints: complaint.complaints,
            created: complaint.created
          };
        }), max: complaintData.max};
      })
    )
    .subscribe((transformData) => {
      this.complaints = transformData.complaints;
      this.complaintsUpdated.next({
        complaints: [...this.complaints],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.complaintsUpdated.asObservable();
  }

  get(id: string) {
    return this.http.get<{ _id: string; complaints: [], created: string, patient: string }>(
      BACKEND_URL + '/' + id
      );
  }

  getLatest() {
    return this.http.get<{ _id: string; complaints: [], created: string, patient: string }>(
      BACKEND_URL + '/latest'
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, complaints: [], created: string, patient: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(created: string, patient: string, complaints: []) {
    const recordData = {
      created, patient, complaints
    };
    return this.http.post<{ message: string, complaint: ComplaintData }>(BACKEND_URL, recordData);
  }

  update(id: string, created: string, patient: string, complaints: []) {
    const recordData = {
        id, created, patient, complaints
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }

}
