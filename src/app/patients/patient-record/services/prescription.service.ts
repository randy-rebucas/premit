import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../../environments/environment';
import { PrescriptionData } from '../models/prescription-data.model';

const BACKEND_URL = environment.apiUrl + '/prescriptions';

@Injectable({providedIn: 'root'})

export class PrescriptionService {
  private prescriptions: PrescriptionData[] = [];
  private prescriptionsUpdated = new Subject<{ prescriptions: PrescriptionData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

  getAll(perPage: number, currentPage: number, complaintId: string) {
    const queryParams = `?complaintId=${complaintId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, prescriptions: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(prescriptionData => {
        return { prescriptions: prescriptionData.prescriptions.map(prescription => {
          return {
            id: prescription._id,
            created: prescription.created,
            complaintId: prescription.complaintId,
            prescriptions: prescription.prescriptions,
          };
        }), max: prescriptionData.max};
      })
    )
    .subscribe((transformData) => {
      this.prescriptions = transformData.prescriptions;
      this.prescriptionsUpdated.next({
        prescriptions: [...this.prescriptions],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.prescriptionsUpdated.asObservable();
  }

  get(id: string) {
    return this.http.get<{ _id: string; prescriptions: [], complaint: string, created: string, patient: string }>(
      BACKEND_URL + '/' + id
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, prescriptions: [], created: string, patient: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(created: string, complaintId: string, prescriptions: []) {
    const recordData = {
      created, complaintId, prescriptions
    };
    return this.http.post<{ message: string, record: PrescriptionData }>(BACKEND_URL, recordData);
  }

  update(id: string, created: string, complaintId: string, prescriptions: []) {

    const recordData = {
        id, created, complaintId, prescriptions
      };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }

}
