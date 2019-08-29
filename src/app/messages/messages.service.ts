import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { environment } from '../../environments/environment';
import { MessagesData } from '../messages/messages-data.model';

const BACKEND_URL = environment.apiUrl + '/assessments';

@Injectable({providedIn: 'root'})

export class MessagesService {
  private messages: MessagesData[] = [];
  private messagesUpdated = new Subject<{ messages: MessagesData[], count: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
    ) {}

    getAll(perPage: number, currentPage: number, practitionerId: string) {
      const queryParams = `?practitionerId=${practitionerId}&pagesize=${perPage}&page=${currentPage}`;
      this.http.get<{message: string, messages: any, max: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(messageData => {
          return { messages: messageData.messages.map(message => {
            return {
              id: message._id,
              created: message.created,
              subject: message.subject,
              message: message.message,
              patient: message.patientId
            };
          }), max: messageData.max};
        })
      )
      .subscribe((transformData) => {
        this.messages = transformData.messages;
        this.messagesUpdated.next({
          messages: [...this.messages],
          count: transformData.max
        });
      });
    }

  getUpdateListener() {
    return this.messagesUpdated.asObservable();
  }

  get(id: string) {
    return this.http.get<{ _id: string, subject: string, message: string, patientId: string, created: string }>(
      BACKEND_URL + '/' + id
      );
  }

  getByMessageId(messageId) {
    return this.http.get<{ _id: string, subject: string, message: string, patientId: string, created: string }>(
      BACKEND_URL + '/message/' + messageId
      );
  }

  insert(subject: string, message: string, patientId: string, created: string, practitionerId: string) {
    const recordData = {
      subject, message, patientId, created, practitionerId
    };
    return this.http.post<{ message: string, record: MessagesData }>(BACKEND_URL, recordData);
  }

  update(id: string, subject: string, message: string, patientId: string, created: string, practitionerId: string) {
    const recordData = {
        id, subject, message, patientId, created, practitionerId
    };
    return this.http.put(BACKEND_URL + '/' + id, recordData);
  }

  delete(recordId: string) {
    return this.http.delete(BACKEND_URL + '/' + recordId);
  }


}
