import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../../../environments/environment';
import { NoteData } from '../models/note.model';

const BACKEND_URL = environment.apiUrl + '/progress-notes';

@Injectable({providedIn: 'root'})

export class NotesService {
  private notes: NoteData[] = [];
  private notesUpdated = new Subject<{ notes: NoteData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patient=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, notes: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(noteData => {
        console.log(noteData);
        return { notes: noteData.notes.map(note => {
          return {
            id: note._id,
            note: note.note,
            created: note.created
          };
        }), max: noteData.max};
      })
    )
    .subscribe((transformData) => {
      this.notes = transformData.notes;
      this.notesUpdated.next({
        notes: [...this.notes],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.notesUpdated.asObservable();
  }

  get(id: string) {
    return this.http.get<{ _id: string; note: string, created: string, patient: string }>(
      BACKEND_URL + '/' + id
      );
  }

  insert(note: string, created: string, patient: string) {
    const recordData = {
      note, created, patient
    };
    return this.http.post<{ message: string, record: NoteData }>(BACKEND_URL, recordData);
  }

  update(id: string, note: string, created: string, patient: string) {
    let recordData: NoteData | FormData;
    recordData = {
        id, note, created, patient
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }

}
