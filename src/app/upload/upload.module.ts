import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import {
  MatButtonModule,
  MatDialogModule,
  MatListModule,
  MatProgressBarModule,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
  ],
  declarations: [UploadComponent],
  exports: [UploadComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class UploadModule {}
