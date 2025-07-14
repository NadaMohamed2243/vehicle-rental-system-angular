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
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { AuthapiService } from './../../services/authapi.service';
import { CustomValidatorService } from '../../services/validators/custom-validator.service';

@Component({
  selector: 'app-agent-register',
  templateUrl: './agent-register.component.html',
  styleUrls: ['./agent-register.component.css'],
  imports: [ReactiveFormsModule, RouterLink, TranslateModule],
})
export class AgentRegisterComponent implements OnInit {
  agentRegisterForm!: FormGroup;
  workingHoursFormArray!: FormArray;
  loading = false;
  apiError: string = '';
  showApiError: boolean = false;

  licensePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  error: string | null = null;

  // Location options
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
  { label: 'Badr', value: 'badr' },
];


  // Days of week for working hours
  englishDaysOfWeek = [
    { name: 'Monday', value: 'mon' },
    { name: 'Tuesday', value: 'tue' },
    { name: 'Wednesday', value: 'wed' },
    { name: 'Thursday', value: 'thu' },
    { name: 'Friday', value: 'fri' },
    { name: 'Saturday', value: 'sat' },
    { name: 'Sunday', value: 'sun' },
  ];

  arabicDaysOfWeek = [
    { name: 'الاثنين', value: 'mon' },
    { name: 'الثلاثاء', value: 'tue' },
    { name: 'الأربعاء', value: 'wed' },
    { name: 'الخميس', value: 'thu' },
    { name: 'الجمعة', value: 'fri' },
    { name: 'السبت', value: 'sat' },
    { name: 'الأحد', value: 'sun' },
  ];

  daysOfWeek = this.englishDaysOfWeek;

  // Injected services
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _customValidator = inject(CustomValidatorService);
  private _authService = inject(AuthapiService);
  private _notification = inject(MatSnackBar);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.setDaysBasedOnLanguage(this.translate.currentLang || 'en');

    this.translate.onLangChange.subscribe((event) => {
      this.setDaysBasedOnLanguage(event.lang);
      this.rebuildWorkingHoursFormArray();
    });

    this.initializeForm();
    this.getUserLocation();
  }

  setDaysBasedOnLanguage(lang: string): void {
    this.daysOfWeek = lang === 'ar' ? this.arabicDaysOfWeek : this.englishDaysOfWeek;
  }

  rebuildWorkingHoursFormArray(): void {
    this.workingHoursFormArray = this._fb.array(
      this.daysOfWeek.map(() =>
        this._fb.group({
          selected: [false],
          from: ['09:00'],
          to: ['17:00'],
        })
      )
    );
    this.agentRegisterForm.setControl('workingHoursFormArray', this.workingHoursFormArray);
  }

  initializeForm(): void {
    this.workingHoursFormArray = this._fb.array(
      this.daysOfWeek.map(() =>
        this._fb.group({
          selected: [false],
          from: ['09:00'],
          to: ['17:00'],
        })
      )
    );

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
  }

  getUserLocation(): void {
    if (!navigator.geolocation) {
      this._notification.open('Geolocation not supported.', 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    if (!window.isSecureContext) {
      this._notification.open(
        'Location access requires a secure connection (HTTPS).',
        'Close',
        { duration: 5000, panelClass: ['snackbar-error'] }
      );
      return;
    }

    const loadingSnackBar = this._notification.open(
      'Getting your location...',
      'Cancel',
      { duration: 15000, panelClass: ['snackbar-info'] }
    );

    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadingSnackBar.dismiss();
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
          loadingSnackBar.dismiss();
          let errorMessage = 'Error getting your location.';
          switch (error.code) {
            case 1:
              errorMessage = 'Location access denied.';
              break;
            case 2:
              errorMessage = 'Location unavailable.';
              break;
            case 3:
              errorMessage = 'Location request timed out.';
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
    return (this.workingHoursFormArray.at(index) as FormGroup).get(controlName) as FormControl;
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
      .filter((day) => day !== null);

    const workingHoursString = workingDays.join(';');
    this.agentRegisterForm.patchValue({ working_hours: workingHoursString });
  }

  onSubmit(): void {
    this.updateWorkingHoursString();
    this.apiError = '';
    this.showApiError = false;

    if (this.agentRegisterForm.valid && this.selectedFile) {
      this.loading = true;
      console.log('Sending data to API', this.agentRegisterForm.value);

      this._authService.registerAgent(this.agentRegisterForm.value, this.selectedFile).subscribe({
        next: (res) => {
          this.loading = false;
          localStorage.setItem('token', res.token);
          this._router.navigate(['/agent-dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.apiError =
            typeof err.error === 'string'
              ? err.error
              : err.error?.error || 'Registration failed. Please try again.';
          this.showApiError = true;
          setTimeout(() => (this.showApiError = false), 5000);
        },
      });
    } else {
      console.log('Form is invalid', this.agentRegisterForm.errors);
      this.agentRegisterForm.markAllAsTouched();
    }
  }
}
