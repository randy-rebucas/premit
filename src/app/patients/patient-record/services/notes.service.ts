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

  getAll(perPage: number, currentPage: number, complaintId: string) {
    const queryParams = `?complaintId=${complaintId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, notes: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(noteData => {
        return { notes: noteData.notes.map(note => {
          return {
            id: note._id,
            created: note.created,
            complaintId: note.complaintId,
            note: note.note
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
    return this.http.get<{ _id: string; created: string, complaintId: string, note: string }>(
      BACKEND_URL + '/' + id
      );
  }

  getLatest() {
    return this.http.get<{ _id: string; created: string, complaintId: string, note: string }>(
      BACKEND_URL + '/latest'
      );
  }

  insert(created: string, complaintId: string, note: string) {
    const recordData = {
      created, complaintId, note
    };
    return this.http.post<{ message: string, record: NoteData }>(BACKEND_URL, recordData);
  }

  update(id: string, created: string, complaintId: string, note: string) {
    let recordData: NoteData | FormData;
    recordData = {
        id, created, complaintId, note
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }

}
