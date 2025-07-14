import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthapiService } from '../../services/authapi.service';
import { ClientauthService } from '../../services/clientauth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  _router = inject(Router);
  _authService = inject(AuthapiService);
  _clientAuthService = inject(ClientauthService);
  apiError: string = '';
  loading: boolean = false;
  showError: boolean = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.loading = true;
      this.showError = false;
      console.log('Sending data to API', this.loginForm.value);
      this._authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.loading = false;
          this._clientAuthService.setTokenAndRole(res.token);
// Check for saved booking info
        const pendingBooking = localStorage.getItem('pendingBooking');
        if (pendingBooking) {
          const bookingData = JSON.parse(pendingBooking);

          // Clear it so it's not reused next time
          localStorage.removeItem('pendingBooking');

          this._router.navigate(['/cars'], {
            queryParams: {
              carId: bookingData.carId,
              pickupDate: bookingData.pickupDate,
              dropoffDate: bookingData.dropoffDate,
              location: bookingData.location,
            }
          });

          return; // Stop further redirection
        }

        // Default role-based redirect

          if (res.user.role == 'admin') {
            this._router.navigate(['/dashboard']);
          } else if (res.user.role == 'client') {
            this._router.navigate(['/home']);
          } else if (res.user.role == 'agent') {
            this._router.navigate(['/agent-dashboard']);
          }
        },
        error:(err) =>{
           this.loading = false;
          console.error('Login error:', err),
          this.apiError =typeof err.error === 'string' ? err.error : err.error?.error || 'Login failed. Please try again.';
          this.showError = true;
          }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
         setTimeout(() => this.showError = false, 5000);
  }
  closeError() {
  this.showError = false;
}
}
