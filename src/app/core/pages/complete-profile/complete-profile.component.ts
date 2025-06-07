import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,ReactiveFormsModule } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthapiService } from './../../services/authapi.service';

@Component({
  selector: 'app-complete-profile',
    imports: [ReactiveFormsModule],

  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css'
})
export class CompleteProfileComponent implements OnInit {
  selectedFile: File | null = null;
  licensePreview: string | ArrayBuffer | null = null;
  error: string | null = null;

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
  _router = inject(Router);
  _authService = inject(AuthapiService);
  _notification = inject(MatSnackBar);
  _route = inject(ActivatedRoute);


  CompleteProfileForm: FormGroup = new FormGroup({
    phone_number: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    location: new FormControl('', [Validators.required]),
    driver_license: new FormControl('', [Validators.required]),
    lat: new FormControl(''),
    lng: new FormControl('')
  });

  ngOnInit(): void {
    this.getUserLocation();

      this._route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        console.log('Token from URL:', token);
        localStorage.setItem('token', token);
      }
    });
  }

  getUserLocation(): void {
    if (!navigator.geolocation || !window.isSecureContext) {
      this._notification.open('Secure location access not supported.', 'Close', { duration: 4000, panelClass: ['snackbar-error'] });
      return;
    }

    const snack = this._notification.open('Getting location...', '', { duration: 15000 });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        snack.dismiss();
        this.CompleteProfileForm.patchValue({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        this._notification.open('Location added!', 'Close', { duration: 3000, panelClass: ['snackbar-success'] });
      },
      (error) => {
        snack.dismiss();
        this._notification.open('Failed to get location.', 'Close', { duration: 5000, panelClass: ['snackbar-error'] });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
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
      this.CompleteProfileForm.get('driver_license')?.setValue(this.selectedFile);
    }
  }

  onSubmit(): void {
  if (this.CompleteProfileForm.valid && this.selectedFile) {
    const formData = new FormData();
    formData.append('phone_number', this.CompleteProfileForm.get('phone_number')?.value);
    formData.append('location', this.CompleteProfileForm.get('location')?.value);
    formData.append('driver_license', this.selectedFile);
    formData.append('lat', this.CompleteProfileForm.get('lat')?.value);
    formData.append('lng', this.CompleteProfileForm.get('lng')?.value);

    const token = localStorage.getItem('token'); // 👈 Get the token here
    console.log("Token in frontend: ", token)
    if (!token) {
      this.error = 'User token not found. Please sign in again.';
      this._notification.open(this.error, 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this._authService.completeGoogleProfile(formData, token).subscribe({
      next: (response) => {
        console.log(response.token)
        localStorage.setItem('token', response.token);
        this._router.navigate(['/home']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Something went wrong';
        this._notification.open(this.error?this.error:'', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    });
  } else {
    this.CompleteProfileForm.markAllAsTouched();
  }
}

}
