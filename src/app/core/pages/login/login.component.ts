import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthapiService } from '../../services/authapi.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  _router = inject(Router);
  _authService = inject(AuthapiService);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });


onSubmit() {
  if (this.loginForm.valid) {
    this._authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);

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
      error: (err) => console.error('Login error:', err),
    });
  } else {
    this.loginForm.markAllAsTouched();
  }
}

}
