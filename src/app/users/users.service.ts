import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../environments/environment';
import { UserData } from './user-data.model';

const BACKEND_URL = environment.apiUrl + '/patients';

@Injectable({providedIn: 'root'})

export class UsersService {
  private patients: UserData[] = [];
  private patientsUpdated = new Subject<{ patients: UserData[], patientCount: number }>();

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
            firstname: patient.firstname,
            midlename: patient.midlename,
            lastname: patient.lastname,
            contact: patient.contact,
            gender: patient.gender,
            birthdate: patient.birthdate,
            address: patient.address,
            imagePath: patient.imagePath,
            client_id: patient.client_id
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
    return this.http.get<{ _id: string; firstname: string, midlename: string, lastname: string, contact: string, gender: string, birthdate: string, address: string, imagePath: string, client_id: string
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
    patientData.append('birthdate', birthdate);
    patientData.append('address', address);
    patientData.append('image', image, firstname);
    return this.http.post<{ message: string, patient: UserData }>(BACKEND_URL, patientData);
  }

  updatePatient(id: string, firstname: string, midlename: string, lastname: string, contact: string, gender: string, birthdate: string, address: string, image: File | string) {
    let patientData: UserData | FormData;
    if (typeof(image) === 'object') {
      patientData = new FormData();
      patientData.append('id', id);
      patientData.append('firstname', firstname);
      patientData.append('midlename', midlename);
      patientData.append('lastname', lastname);
      patientData.append('contact', contact);
      patientData.append('gender', gender);
      patientData.append('birthdate', birthdate);
      patientData.append('address', address);
      patientData.append('image', image, firstname);
    } else {
      patientData = {
        id: id, firstname: firstname, midlename: midlename, lastname: lastname, contact: contact, gender: gender, birthdate: birthdate, address: address, imagePath: image, client: null
      };
    }

    return this.http.put(BACKEND_URL + '/' + id, patientData);
  }

  deletePatient(userId: string) {
    return this.http.delete(BACKEND_URL + '/' + userId);
  }

}
