import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

import { BarcodeFormat } from '@zxing/library';

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

  // scanSuccessHandler(event) {
  //   console.log(event);
  // }

  // scanErrorHandler(event) {
  //   console.log(event);
  // }

  // scanFailureHandler(event) {
  //   console.log(event);
  // }

  scanCompleteHandler(event) {
    //console.log(event);
    // tslint:disable-next-line: triple-equals
    if (event != 'undefined') {
      console.log(event.Result);
    }
  }
  // format: 11
  // numBits: 368
  // rawBytes: Uint8Array(46) [66, 131, 35, 6, 38, 38, 83, 19, 83, 102, 38, 51, 102, 83, 86, 38, 19, 19, 134, 67, 54, 99, 6, 51, 115, 35, 22, 51, 147, 6, 38, 102, 51, 70, 102, 67, 134, 35, 19, 38, 83, 96, 236, 17, 236, 17]
  // resultMetadata: Map(2) {2 => Array(1), 3 => "H"}
  // resultPoints: (4) [FinderPattern, FinderPattern, FinderPattern, AlignmentPattern]
  // text: "20bbe156bc6e5ba18d3f0c721c90bfc4fd8b12e6"
  // timestamp: 1566782430505
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
