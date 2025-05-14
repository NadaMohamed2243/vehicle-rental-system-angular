import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  _router=inject(Router);
  forgetForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email]),
  });
  

  onSubmit() {
    console.log(this.forgetForm.value);
    if (this.forgetForm.valid) {
      console.log('Sending data to API', this.forgetForm.value);
      this._router.navigate(['/pendingResetPassword']);
      // Api
    } else {
      this.forgetForm.markAllAsTouched();
    }
  }
}
