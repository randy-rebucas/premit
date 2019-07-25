import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth-guard';
import { TransfersComponent } from './transfers/transfers.component';
import { TransferStartComponent } from './transfers/transfer-start/transfer-start.component';
import { TransferAmountEditComponent } from './transfers/transfer-amount-edit/transfer-amount-edit.component';
import { TransferRecipientEditComponent } from './transfers/transfer-recipient-edit/transfer-recipient-edit.component';
import { TransferSenderEditComponent } from './transfers/transfer-sender-edit/transfer-sender-edit.component';
import { TransferSummaryComponent } from './transfers/transfer-summary/transfer-summary.component';
import { TransferCheckoutComponent } from './transfers/transfer-checkout/transfer-checkout.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/transfer', pathMatch: 'full' },
    { path: 'transfer', component: TransfersComponent, canActivate: [AuthGuard], children: [
        { path: '', component: TransferStartComponent},
        { path: 'amount', component: TransferAmountEditComponent },
        { path: 'recipient', component: TransferRecipientEditComponent },
        { path: 'sender', component: TransferSenderEditComponent },
        { path: 'summary', component: TransferSummaryComponent },
        { path: 'checkout', component: TransferCheckoutComponent },
        { path: ':id/edit-amount', component: TransferAmountEditComponent },
        { path: ':id/edit-recipient', component: TransferRecipientEditComponent },
        { path: ':id/edit-sender', component: TransferSenderEditComponent }
    ] },
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
    { path: 'not-found', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/not-found' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true }
        )
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {

}

