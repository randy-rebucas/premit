import { Component, OnInit  } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AppConfiguration } from './app-configuration.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Premit Remittance Services';
  apiUrl;

  constructor(
    private authService: AuthService,
    appconfig: AppConfiguration,
    private titleService: Title
    ) {
      this.title = appconfig.title;
      this.apiUrl = appconfig.apiUrl;
    }

    public setTitle( newTitle: string) {
      this.titleService.setTitle( newTitle );
    }

  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
