import {  AuthapiService } from './../../services/authapi.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidatorService } from '../../services/validators/custom-validator.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  licensePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  locations: { label: string; value: string }[] = [
    { label: 'Cairo', value: 'cairo' },
    { label: 'Giza', value: 'giza' },
    { label: 'Alexandria', value: 'alexandria' },
    { label: 'Port Said', value: 'port_said' },
    { label: 'Suez', value: 'suez' },
    { label: 'Mansoura', value: 'mansoura' },
    { label: 'Tanta', value: 'tanta' },
    { label: 'Zagazig', value: 'zagazig' },
    { label: 'Ismailia', value: 'ismailia' },
    { label: 'Fayoum', value: 'fayoum' },
    { label: 'Beni Suef', value: 'beni_suef' },
    { label: 'Minya', value: 'minya' },
    { label: 'Asyut', value: 'asyut' },
    { label: 'Sohag', value: 'sohag' },
    { label: 'Qena', value: 'qena' },
    { label: 'Luxor', value: 'luxor' },
    { label: 'Aswan', value: 'aswan' },
    { label: 'Hurghada', value: 'hurghada' },
    { label: 'Sharm El Sheikh', value: 'sharm_el_sheikh' },
    { label: 'Damanhur', value: 'damanhur' },
    { label: 'Damietta', value: 'damietta' },
    { label: 'El Arish', value: 'el_arish' },
    { label: 'Banha', value: 'banha' },
    { label: 'Kafr El Sheikh', value: 'kafr_el_sheikh' },
    { label: 'Mahalla', value: 'mahalla' },
    { label: 'Qalyub', value: 'qalyub' },
    { label: '6th of October', value: 'sixth_october' },
    { label: 'New Cairo', value: 'new_cairo' },
    { label: 'Obour', value: 'obour' },
    { label: '10th of Ramadan', value: 'tenth_ramadan' },
    { label: 'Badr', value: 'badr' }
  ];
  _router=inject(Router)
  _customValidator=inject(CustomValidatorService)
  _authService=inject(AuthapiService);
  _notification = inject(MatSnackBar);

  ngOnInit(): void {
     // Get user location and patch to form or show notification on error
    this.getUserLocation();
  }
  getUserLocation(): void {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      this._notification.open(
        'Geolocation is not supported by your browser.',
        'Close',
        { duration: 5000, panelClass: ['snackbar-error'] }
      );
      return;
    }

    // Check if we're in a secure context (HTTPS or localhost)
    if (!window.isSecureContext) {
      this._notification.open(
        'Location access requires a secure connection (HTTPS).',
        'Close',
        { duration: 5000, panelClass: ['snackbar-error'] }
      );
      return;
    }

    // Show loading message
    const loadingSnackBar = this._notification.open(
      'Getting your location...',
      'Cancel',
      { duration: 15000, panelClass: ['snackbar-info'] }
    );

    // Add a small delay to ensure the loading message shows
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (loadingSnackBar) {
            loadingSnackBar.dismiss();
          }

          this.registerForm.patchValue({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          this._notification.open('Location obtained successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
        },
        (error) => {
          console.warn('Geolocation error:', error);

          if (loadingSnackBar) {
            loadingSnackBar.dismiss();
          }

          let errorMessage = 'Error getting your location. Please try again.';

          switch (error.code) {
            case 1:
              errorMessage =
                'Location access denied. Please allow location access in your browser and try again.';
              break;
            case 2:
              errorMessage =
                'Location information unavailable. Please check your connection and try again.';
              break;
            case 3:
              errorMessage = 'Location request timed out. Please try again.';
              break;
          }

          this._notification.open(errorMessage, 'Close', {
            duration: 8000,
            panelClass: ['snackbar-error'],
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }, 100);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.licensePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  registerForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    cPassword: new FormControl('', [Validators.required]),
    phone_number: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    location: new FormControl('', [Validators.required]),
    driver_license: new FormControl('', [Validators.required]),
    lat: new FormControl(''),
    lng: new FormControl('')
  },{ validators:this._customValidator.matchPasswords() });


  onSubmit() {
    if (this.registerForm.valid  && this.selectedFile) {
      console.log('Sending data to API', this.registerForm.value);
      // Api
      const formData = new FormData();
      formData.append('first_name', this.registerForm.get('first_name')?.value);
      formData.append('last_name', this.registerForm.get('last_name')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('phone_number', this.registerForm.get('phone_number')?.value);
      formData.append('location', this.registerForm.get('location')?.value);
      formData.append('driver_license', this.selectedFile);
      formData.append('lat', this.registerForm.get('lat')?.value );
      formData.append('lng', this.registerForm.get('lng')?.value );
      this._authService.registerClient(formData).subscribe({
  next: (response) => {
      console.log('Register success:', response);
      localStorage.setItem('token', response.token);
      // Navigate to another page
      this._router.navigate(['/home']);
    },
    error: err => console.error('Error:', err)
    });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
