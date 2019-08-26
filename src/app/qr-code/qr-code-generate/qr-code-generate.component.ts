import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-qr-code-generate',
  templateUrl: './qr-code-generate.component.html',
  styleUrls: ['./qr-code-generate.component.css']
})
export class QrCodeGenerateComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  public myAngularxQrCode: string = null;
  title: string;

  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    public dialogRef: MatDialogRef < QrCodeGenerateComponent >,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      this.title = data.title;
      this.myAngularxQrCode = data.patientId; // 'Your QR code data string';
     }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  printQr() {

  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
