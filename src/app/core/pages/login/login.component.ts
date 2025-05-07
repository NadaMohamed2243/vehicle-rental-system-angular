import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  _router=inject(Router);
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', [Validators.required,Validators.minLength(6)]),
  });
  

  onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      console.log('Sending data to API', this.loginForm.value);
      this._router.navigate(['/home']);
      // Api
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
