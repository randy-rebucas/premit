import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../environments/environment';
import { PatientData } from './patient-data.model';

const BACKEND_URL = environment.apiUrl + '/patients';

@Injectable({providedIn: 'root'})

export class PatientsService {
  private patients: PatientData[] = [];
  private patientsUpdated = new Subject<{ patients: PatientData[], patientCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

  getPatients(clientId: string, patientPerPage: number, currentPage: number) {
    const queryParams = `?client=${clientId}&pagesize=${patientPerPage}&page=${currentPage}`;
    this.http.get<{message: string, patients: any, maxPatients: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(patientData => {
        return { patients: patientData.patients.map(patient => {
          return {
            id: patient._id,
            firstname: patient.personId.firstname,
            midlename: patient.personId.midlename,
            lastname: patient.personId.lastname,
            contact: patient.personId.contact,
            gender: patient.personId.gender,
            birthdate: patient.personId.birthdate,
            address: patient.personId.address,
            bloodType: patient.bloodType,
            comments: patient.comments,
            clientId: patient.clientId
          };
        }), maxPatients: patientData.maxPatients};
      })
    )
    .subscribe((transformpatientsData) => {
      this.patients = transformpatientsData.patients;
      this.patientsUpdated.next({
        patients: [...this.patients],
        patientCount: transformpatientsData.maxPatients
      });
    });
  }

  getPatientUpdateListener() {
    return this.patientsUpdated.asObservable();
  }

  getPatient(id: string) {
    // tslint:disable-next-line: max-line-length
    return this.http.get<{ _id: string, bloodType: string, comments: string, personId: string, clientId: string, firstname: any, midlename: any, lastname: string, contact: string, gender: string, birthdate: string, address: string }>(
        BACKEND_URL + '/' + id
      );
  }

  addPatient(_firstname: string, _midlename: string, _lastname: string, _contact: string, _bloodType: string, _gender: string, _birthdate: string, _address: string, _comments: string) {
      const patientData = {
        firstname: _firstname,
        midlename: _midlename,
        lastname: _lastname,
        contact: _contact,
        bloodType: _bloodType,
        gender: _gender,
        birthdate: _birthdate,
        address: _address,
        comments: _comments
      };
    return this.http.post<{ message: string, patient: PatientData }>(BACKEND_URL, patientData);
  }

  updatePatient(_id: string, _personId: string, _firstname: string, _midlename: string, _lastname: string, _contact: string, _bloodType: string, _gender: string, _birthdate: string, _address: string, _comments: string) {
    const patientData = {
      id: _id,
      firstname: _firstname,
      midlename: _midlename,
      lastname: _lastname,
      contact: _contact,
      bloodType: _bloodType,
      gender: _gender,
      birthdate: _birthdate,
      address: _address,
      comments: _comments
    };
    return this.http.put(BACKEND_URL + '/' + _id + '/' + _personId, patientData);
  }

  deletePatient(patientId: string) {
    return this.http.delete(BACKEND_URL + '/' + patientId);
  }

}
