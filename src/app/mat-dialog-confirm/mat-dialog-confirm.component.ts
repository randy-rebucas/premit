import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-mat-dialog-confirm',
  templateUrl: './mat-dialog-confirm.component.html',
  styleUrls: ['./mat-dialog-confirm.component.css']
})
export class MatDialogConfirmComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialogRef: MatDialogRef<MatDialogConfirmComponent>) { }

  ngOnInit() {

  }

  closeDialog() {
    this.dialogRef.close(false);
  }

}
