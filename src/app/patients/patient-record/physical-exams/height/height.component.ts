import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-height',
  template: `<mat-grid-tile [colspan]="2" [rowspan]="2">
                <mat-grid-tile-header>Height</mat-grid-tile-header>
                    <app-height-list></app-height-list>
                <mat-grid-tile-footer>Footer</mat-grid-tile-footer>
            </mat-grid-tile>`
})
export class HeightComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private notificationService: NotificationService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
