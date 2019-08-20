import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

import { AuthService } from '../../../../auth/auth.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { NotesService } from '../../services/notes.service';
import { NoteData } from '../../models/note.model';

@Component({
  selector: 'app-progress-note-edit',
  templateUrl: './progress-note-edit.component.html',
  styleUrls: ['./progress-note-edit.component.css']
})
export class ProgressNoteEditComponent implements OnInit, OnDestroy {
  perPage = 10;
  currentPage = 1;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  noteData: NoteData;
  isLoading = false;
  private mode = 'create';
  private recordId: string;
  patientId: string;
  title: string;
  patient: string;
  complaintId: string;
  form: FormGroup;

  maxDate = new Date();

  constructor(
    public notesService: NotesService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private datePipe: DatePipe,

    private notificationService: NotificationService,
    public dialogRef: MatDialogRef < ProgressNoteEditComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      this.recordId = data.id;
      this.complaintId = data.complaintIds;
      this.title = data.title;
    }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = new FormGroup({
      note: new FormControl(null, {
        validators: [Validators.required, Validators.maxLength(300) ]
      }),
      record_date: new FormControl(new Date(), {
        validators: [Validators.required]
      })
    });

    if (this.recordId) {
          this.mode = 'edit';
          this.isLoading = true;
          this.notesService.get(this.recordId).subscribe(recordData => {
            this.isLoading = false;
            this.noteData = {
              id: recordData._id,
              created: recordData.created,
              complaintId: recordData.complaintId,
              note: recordData.note,
            };
            this.form.setValue({
              record_date: this.noteData.created,
              note: this.noteData.note
            });
          });
        } else {
          this.mode = 'create';
          this.recordId = null;
        }
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.complaintId);
    console.log(this.form.value);
    if (this.mode === 'create') {
      this.notesService.insert(
        this.form.value.record_date,
        this.complaintId,
        this.form.value.note
      ).subscribe(() => {
        this.form.reset();
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.notesService.getLatest().subscribe(
          recordData => {
            this.complaintId = null;
            if (Object.keys(recordData).length) {
              this.complaintId = recordData[0]._id;
              this.notesService.getAll(this.perPage, this.currentPage, recordData[0]._id);
            }
          }
        );
      });
    } else {
      this.notesService.update(
        this.recordId,
        this.form.value.record_date,
        this.complaintId,
        this.form.value.note
      ).subscribe(() => {
        this.form.reset();
        this.onClose();
        this.notificationService.success(':: Added successfully');
        this.notesService.getLatest().subscribe(
          recordData => {
            this.complaintId = null;
            if (Object.keys(recordData).length) {
              this.complaintId = recordData[0]._id;
              this.notesService.getAll(this.perPage, this.currentPage, recordData[0]._id);
            }
          }
        );
      });
    }
  }

  onClose() {
    this.form.reset();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
