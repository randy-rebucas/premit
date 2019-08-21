import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AppConfiguration } from '../app-configuration.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent  implements OnInit, OnDestroy {
  title: string;

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  license: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    appconfig: AppConfiguration
    ) {
      this.title = appconfig.title;
    }

    ngOnInit() {
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        });
  
      this.license = this.authService.getUserLicense();
    }
  
    onLogout() {
      this.authService.logout();
    }
  
    ngOnDestroy() {
      this.authListenerSubs.unsubscribe();
    }
}
