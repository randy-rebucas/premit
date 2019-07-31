import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AppConfiguration } from '../app-configuration.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  title;
  apiUrl;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(
    private authService: AuthService,
    appconfig: AppConfiguration
    ) {
      this.title = appconfig.title;
      this.apiUrl = appconfig.apiUrl;
    }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
