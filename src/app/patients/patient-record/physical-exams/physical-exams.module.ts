import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../../../angular-material.module';
import { HeightComponent } from './height/height.component';
import { HeightListComponent } from './height/height-list/height-list.component';

@NgModule({
  declarations: [
    HeightComponent,
    HeightListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PhysicalExamModule {}
