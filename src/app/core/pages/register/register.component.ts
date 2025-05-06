import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidatorService } from '../../services/validators/custom-validator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
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
    name: new FormControl('', [Validators.required,Validators.minLength(3),Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', [Validators.required,Validators.minLength(6)]),
    cPassword: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)]),
    location: new FormControl('', [Validators.required]),
    licenseImage: new FormControl('', [Validators.required])
  },{ validators:this._customValidator.matchPasswords() });
  

  onSubmit() {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      console.log('Sending data to API', this.registerForm.value);
      this._router.navigate(['/login']);
      // Api
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
