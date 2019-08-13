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
      this.patientId = data.patient;
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
              note: recordData.note,
              created: recordData.created,
              patient: recordData.patient
            };
            this.form.setValue({
              note: this.noteData.note,
              record_date: this.noteData.created
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
    if (this.mode === 'create') {
      this.notesService.insert(
        this.form.value.note,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.notesService.getAll(this.perPage, this.currentPage, this.patientId);
      });

      this.form.reset();
      this.notificationService.success(':: Added successfully');
      this.onClose();
    } else {
      this.notesService.update(
        this.recordId,
        this.form.value.note,
        this.form.value.record_date,
        this.patientId
      ).subscribe(() => {
        this.notesService.getAll(this.perPage, this.currentPage, this.patientId);
      });

      this.form.reset();
      this.notificationService.success(':: Updated successfully');
      this.onClose();
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
