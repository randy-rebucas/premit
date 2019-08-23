import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../../environments/environment';
import { AssessmentData } from '../models/assessment-data.model';

const BACKEND_URL = environment.apiUrl + '/assessments';

@Injectable({providedIn: 'root'})

export class AssessmentService {
  private assessments: AssessmentData[] = [];
  private assessmentsUpdated = new Subject<{ assessments: AssessmentData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

    getAll(perPage: number, currentPage: number, complaintId: string) {
      const queryParams = `?complaintId=${complaintId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, assessments: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(assessmentData => {
          console.log(assessmentData);
          return { complaints: assessmentData.assessments.map(assessment => {
            return {
              id: assessment._id,
              created: assessment.created,
              complaintId: assessment.complaintId,
              diagnosis: assessment.diagnosis,
              treatments: assessment.treatments
            };
          }), max: assessmentData.max};
        })
      )
      .subscribe((transformData) => {
        this.assessments = transformData.complaints;
        this.assessmentsUpdated.next({
          assessments: [...this.assessments],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.assessmentsUpdated.asObservable();
  }

  get(id: string) {
    return this.http.get<{ _id: string; complaintId: string, diagnosis: [], treatments: [] }>(
      BACKEND_URL + '/' + id
      );
  }

  getLatest() {
    return this.http.get<{ _id: string; complaintId: string, diagnosis: [], treatments: [] }>(
      BACKEND_URL + '/latest'
      );
  }

  getByComplaintId(complaintId) {
    return this.http.get<{ _id: string; complaintId: string, diagnosis: [], treatments: [] }>(
      BACKEND_URL + '/complaint/' + complaintId
      );
  }

  getLast(patientId) {
    return this.http.get<{ _id: string, complaints: [], created: string, patient: string }>(
      BACKEND_URL + '/last/' + patientId
      );
  }

  insert(created: string, complaintId: string, diagnosis: [], treatments: []) {
    const recordData = {
      created, complaintId, diagnosis, treatments
    };
    return this.http.post<{ message: string, record: AssessmentData }>(BACKEND_URL, recordData);
  }

  update(id: string, created: string, complaintId: string, diagnosis: [], treatments: []) {
    const recordData = {
        id, created, complaintId, diagnosis, treatments
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }

}
