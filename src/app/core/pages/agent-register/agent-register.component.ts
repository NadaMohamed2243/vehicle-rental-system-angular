import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthapiService } from './../../services/authapi.service';
import { CustomValidatorService } from '../../services/validators/custom-validator.service';


@Component({
  selector: 'app-agent-register',
  templateUrl: './agent-register.component.html',
  styleUrls: ['./agent-register.component.css'],
  imports: [ReactiveFormsModule, RouterLink],
})
export class AgentRegisterComponent implements OnInit {
  agentRegisterForm!: FormGroup;
  workingHoursFormArray!: FormArray;

  licensePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  error:string|null=null;

  // Location options
  locations = [
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
    { label: 'Badr', value: 'badr' },
  ];

  // Days of week for working hours
  daysOfWeek = [
    { name: 'Monday', value: 'mon' },
    { name: 'Tuesday', value: 'tue' },
    { name: 'Wednesday', value: 'wed' },
    { name: 'Thursday', value: 'thu' },
    { name: 'Friday', value: 'fri' },
    { name: 'Saturday', value: 'sat' },
    { name: 'Sunday', value: 'sun' },
  ];

  // Injected services
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _customValidator = inject(CustomValidatorService);
  private _authService = inject(AuthapiService);
  private _notification = inject(MatSnackBar);

  ngOnInit(): void {
    // Initialize working hours form array
    this.workingHoursFormArray = this._fb.array(
      this.daysOfWeek.map(() =>
        this._fb.group({
          selected: [false],
          from: ['09:00'],
          to: ['17:00'],
        })
      )
    );

    // Initialize main form group
    this.agentRegisterForm = new FormGroup(
      {
        company_name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        cPassword: new FormControl('', [Validators.required]),
        phone_number: new FormControl('', [
          Validators.required,
          Validators.pattern(/^01[0125][0-9]{8}$/),
        ]),
        location: new FormControl('', [Validators.required]),
        ID_document: new FormControl('', [Validators.required]),
        lat: new FormControl(''),
        lng: new FormControl(''),
        working_hours: new FormControl('', [Validators.required]),
      },
      { validators: this._customValidator.matchPasswords() }
    );

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

          this.agentRegisterForm.patchValue({
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

  getDayControl(index: number, controlName: string): FormControl {
    return (this.workingHoursFormArray.at(index) as FormGroup).get(
      controlName
    ) as FormControl;
  }

  updateWorkingHoursString(): void {
    const workingDays = this.workingHoursFormArray.controls
      .map((control, index) => {
        if (control.get('selected')?.value) {
          const day = this.daysOfWeek[index].value;
          const from = control.get('from')?.value;
          const to = control.get('to')?.value;
          return `${day}:${from}-${to}`;
        }
        return null;
      })
      .filter(day => day !== null);

    const workingHoursString = workingDays.join(';');
    this.agentRegisterForm.patchValue({ working_hours: workingHoursString });
  }

  onSubmit(): void {
    this.updateWorkingHoursString();
    if (this.agentRegisterForm.valid && this.selectedFile) {
      console.log('Sending data to API', this.agentRegisterForm.value);
      this._authService.registerAgent(this.agentRegisterForm.value, this.selectedFile).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this._router.navigate(['/home']);
        },
        error: (err) => {
          this.error= err.error.error
      console.log(err.error.error);
        },
      });
    } else {
      console.log('Form is invalid', this.agentRegisterForm.errors);
      this.agentRegisterForm.markAllAsTouched();
    }
  }
}

