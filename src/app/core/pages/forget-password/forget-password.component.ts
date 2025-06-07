import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthapiService } from '../../services/authapi.service';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  message: string = '';
  error: string = '';

  _router=inject(Router);
  _authServie=inject(AuthapiService);

  forgetForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email]),
  });


  onSubmit() {
    console.log(this.forgetForm.value);
    if (this.forgetForm.valid) {
      const formData = {
          email: this.forgetForm.get('email')?.value
        };
      this._authServie.forgotPassword(formData).subscribe({
      next: res => {
        this.message = 'Check your email for reset instructions.';
        this._router.navigate(['/pendingResetPassword']);
        console.log("reset done");
      },
      error: err => this.error = err.error?.error || 'Error sending reset email'});
      // Api
    } else {
      this.forgetForm.markAllAsTouched();
    }
  }
}
