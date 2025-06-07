import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthapiService } from '../../services/authapi.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports:[ReactiveFormsModule,RouterLink],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  message: string = '';
  error: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthapiService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: [this.passwordsMatchValidator] }
    );
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const password = this.resetForm.get('newPassword')?.value;

    this.authService.resetPassword(this.token, password).subscribe({
      next: res => {
        console.log("reset done");
        this.message = 'Password reset successfully.';
        this.error = '';
        this.resetForm.reset();
        
      },
      error: err => {
        console.log("reset error");
        this.error = err.error?.error || 'Reset failed';
        this.message = '';
      }
    });
    } else {
      this.resetForm.markAllAsTouched();
    }

  }
}
