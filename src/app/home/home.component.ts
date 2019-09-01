import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { AppSettings } from '../shared/appsettings';
import { AppSettingsService } from '../shared/appsettings.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @Input() title: string;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  license: string;
  settings: AppSettings;
  version: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private appSettingsService: AppSettingsService
  ) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.appSettingsService.getSettings()
    .subscribe(
      settings => this.settings = settings,
      () => null,
      () => {
        this.version = this.settings.defaultVersion;
        this.license = this.authService.getUserLicense();
      });

  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
