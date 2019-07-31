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

  getPatients(patientPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${patientPerPage}&page=${currentPage}`;
    this.http.get<{message: string, patients: any, maxPatients: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(patientData => {
        return { patients: patientData.patients.map(patient => {
          return {
            id: patient._id,
            firstname: patient.firstname,
            midlename: patient.midlename,
            lastname: patient.lastname,
            contact: patient.contact,
            gender: patient.gender,
            birthdate: patient.birthdate,
            address: patient.address,
            imagePath: patient.imagePath,
            creator: patient.creator
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
    return this.http.get<{ _id: string; firstname: string, midlename: string, lastname: string, contact: string, gender: string, birthdate: string, address: string, imagePath: string, creator: string
    }>(
      BACKEND_URL + '/' + id
      );
  }

  addPatient(firstname: string, midlename: string, lastname: string, contact: string, gender: string, birthdate: string, address: string, image: File
    ) {
    const patientData = new FormData();
    patientData.append('firstname', firstname);
    patientData.append('midlename', midlename);
    patientData.append('lastname', lastname);
    patientData.append('contact', contact);
    patientData.append('gender', gender);
    patientData.append('birthdate', birthdate == '' ? '' : this.datePipe.transform(birthdate, 'yyyy-MM-dd'));
    patientData.append('address', address);
    patientData.append('image', image, firstname);
    return this.http.post<{ message: string, patient: PatientData }>(BACKEND_URL, patientData);
  }

  updatePatient(id: string, firstname: string, midlename: string, lastname: string, contact: string, gender: string, birthdate: string, address: string, image: File | string) {
    let patientData: PatientData | FormData;
    if (typeof(image) === 'object') {
      patientData = new FormData();
      patientData.append('id', id);
      patientData.append('firstname', firstname);
      patientData.append('midlename', midlename);
      patientData.append('lastname', lastname);
      patientData.append('contact', contact);
      patientData.append('gender', gender);
      patientData.append('birthdate', birthdate == '' ? '' : this.datePipe.transform(birthdate, 'yyyy-MM-dd'));
      patientData.append('address', address);
      patientData.append('image', image, firstname);
    } else {
      patientData = {
        id: id, firstname: firstname, midlename: midlename, lastname: lastname, contact: contact, gender: gender, birthdate: birthdate, address: address, imagePath: image, creator: null
      };
    }

    return this.http.put(BACKEND_URL + '/' + id, patientData);
  }

  deletePatient(patientId: string) {
    return this.http.delete(BACKEND_URL + '/' + patientId);
  }

}
