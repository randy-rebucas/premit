import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

export interface Complaint {
  text: string;
}

@Component({
  selector: 'app-chief-complaint',
  templateUrl: './chief-complaint.component.html',
  styleUrls: ['./chief-complaint.component.css']
})
export class ChiefComplaintComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  breakpoint: number;

  constructor(private authService: AuthService,
              private router: Router,
              public route: ActivatedRoute,
              private notificationService: NotificationService) {}

  ngOnInit() {

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 2;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 2;
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
