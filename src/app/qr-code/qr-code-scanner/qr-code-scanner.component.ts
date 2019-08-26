import { Component, OnInit, OnDestroy, VERSION, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { BarcodeFormat } from '@zxing/library';
// import { Result } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrCodeScannerComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  isLoading = false;

  allowedFormats: any;
  scannerEnabled: boolean;
  qrResultString: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.allowedFormats = [ BarcodeFormat.QR_CODE ];
    this.scannerEnabled = false;

  }

  onToggleScan() {
    this.scannerEnabled = !this.scannerEnabled;
  }

  handleQrCodeResult(resultString: string) {
    if  (resultString != null) {
      this.router.navigateByUrl('/patients/' + resultString + '/record/physical-exams/height');
    }
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
