import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { TransferStartComponent } from './transfer-start/transfer-start.component';
import { TransferAmountEditComponent } from './transfer-amount-edit/transfer-amount-edit.component';
import { TransferRecipientEditComponent } from './transfer-recipient-edit/transfer-recipient-edit.component';
import { TransferSenderEditComponent } from './transfer-sender-edit/transfer-sender-edit.component';
import { TransferSummaryComponent } from './transfer-summary/transfer-summary.component';
import { TransferCheckoutComponent } from './transfer-checkout/transfer-checkout.component';

@NgModule({
  declarations: [
    TransferStartComponent,
    TransferAmountEditComponent,
    TransferRecipientEditComponent,
    TransferSenderEditComponent,
    TransferSummaryComponent,
    TransferCheckoutComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class TransfersModule {}
