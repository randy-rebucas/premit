import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from 'src/app/patients/patient-edit/mime-type.validator';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-settings-general',
  templateUrl: './setting-general.component.html'
})
export class SettingsGeneralComponent implements OnInit, OnDestroy {
  form: FormGroup;
  imagePreview: string;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.form = new FormGroup({
        clinicname: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50) ]
        })
      });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }

    this.form.reset();
    this.notificationService.success(':: Updated successfully');
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
