import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfer-start',
  templateUrl: './transfer-start.component.html',
  styleUrls: ['./transfer-start.component.css']
})
export class TransferStartComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }

  ngOnInit() {

  }

  onStart() {
    this.router.navigate(['/transfer/amount']);
  }

  ngOnDestroy() {

  }
}
