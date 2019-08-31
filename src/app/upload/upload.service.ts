import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
} from '@angular/common/http';
// import { Subject } from 'rxjs/Subject';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UploadData } from '../upload/upload-data.model';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/upload';

@Injectable({providedIn: 'root'})

export class UploadService {
  private files: UploadData[] = [];
  private filesUpdated = new Subject<{ files: UploadData[], count: number }>();

  constructor(private http: HttpClient) {}

  getAll(perPage: number, currentPage: number, patientId: string) {
    const queryParams = `?patient=${patientId}&pagesize=${perPage}&page=${currentPage}`;
    this.http.get<{message: string, files: any, max: number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(fileData => {
        return { files: fileData.files.map(file => {
          return {
            id: file._id,
            path: file.path,
            name: file.name,
            type: file.type,
            created: file.created
          };
        }), max: fileData.max};
      })
    )
    .subscribe((transformData) => {
      this.files = transformData.files;
      this.filesUpdated.next({
        files: [...this.files],
        count: transformData.max
      });
    });
  }

  getUpdateListener() {
    return this.filesUpdated.asObservable();
  }

  getFile(fileId: string) {
    return this.http.get<{ _id: string, path: string, name: string, type: string, created: string}>(
      BACKEND_URL + '/' + fileId
      );
  }

  getLatest() {
    return this.http.get<{ _id: string, path: string, name: string, type: string, created: string }>(
      BACKEND_URL + '/latest'
      );
  }

  getByComplaintId(complaintId) {
    return this.http.get<{ _id: string, path: string, name: string, type: string, created: string }>(
      BACKEND_URL + '/complaint/' + complaintId
      );
  }

  public upload(files: Set<File>, clientId: string, patientId: string, complaintId: string):
    { [key: string]: { progress: Observable<number> } } {

    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<number> } } = {};

    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('patient', patientId);
      formData.append('clientId', clientId);
      formData.append('complaintId', complaintId);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', BACKEND_URL, formData, {
        reportProgress: true
      });

      // create a new progress-subject for every file
      const progress = new Subject<number>();

      // send the http-request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {

          // calculate the progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // pass the percentage into the progress-stream
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {

          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });

    // return the map of progress.observables
    return status;
  }

  deleteFile(fileId: string) {
    return this.http.delete(BACKEND_URL + '/' + fileId);
  }
}
