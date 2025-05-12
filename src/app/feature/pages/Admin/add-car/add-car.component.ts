import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClient } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-car',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,InputTextModule,ButtonModule,MessageModule,FloatLabelModule,FileUploadModule,CalendarModule],
  templateUrl: './add-car.component.html',
  styleUrl: './add-car.component.css'
})
export class AddCarComponent {

  carForm: FormGroup;
  submitted = false;
  imagePreview: string | ArrayBuffer | null = null;
  additionalImagesPreviews: string[] = [];
  carData: any;
  formTitle: string = 'Add Car';



  constructor(private fb: FormBuilder,private http: HttpClient, private router: Router) {
    this.carForm = this.fb.group({
      car_id: [''],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [null, [Validators.required, Validators.min(1990)]],
      license_plate: ['', Validators.required],
      type: ['', Validators.required],
      transmission: ['', Validators.required],
      fuel_type: ['', Validators.required],
      seats: [null, [Validators.required, Validators.min(1)]],
      color: ['', Validators.required],
      mileage: [null, Validators.required],
      rental_rate_per_day: [null, Validators.required],
      rental_rate_per_hour: [null, Validators.required],
      availability_status: ['', Validators.required],
      current_location: ['', Validators.required],
      deposit_required: [null],
      insurance_status: [''],
      last_maintenance_date: ['', Validators.required],
      next_maintenance_due: ['', Validators.required],
      condition_notes: [''],
      fuel_level: [''],
      odometer_reading: [null],
      date_added_to_fleet: [''],
      last_rented_date: [''],
      expected_return_date: [''],
      rating: [null],
      rental_history: [[]],
      car_photos: [null, Validators.required],
      daily_rate: [null, [Validators.required, Validators.min(0)]],
      hourly_rate: [null, [Validators.required, Validators.min(0)]],
    });
  }

  onImageSelected(event: any) {
    const file = event.files?.[0] || event.target?.files?.[0];
    if (file) {
      this.carForm.patchValue({ car_photos: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  //
  onAdditionalImagesSelected(event: any) {
    const files = event.files;
    if (files && files.length > 0) {
      this.carForm.patchValue({ additional_images: files });
      this.additionalImagesPreviews = [];
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = () => this.additionalImagesPreviews.push(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  removeAdditionalImage(preview: string) {
    this.additionalImagesPreviews = this.additionalImagesPreviews.filter(img => img !== preview);
    const files = this.carForm.get('additional_images')?.value;
    this.carForm.patchValue({
      additional_images: files.filter((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return reader.result !== preview;
      })
    });
  }



  

 submitForm() {
  this.submitted = true;
  if (this.carForm.invalid) return;

  const formData = new FormData();
  Object.entries(this.carForm.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value instanceof Blob ? value : JSON.stringify(value));
    }
  });

  if (this.carData) {
    // edit car
    this.http.put(`YOUR_UPDATE_API_URL/${this.carData.id}`, formData).subscribe({
      next: (res) => {
        console.log('Car updated successfully', res);
        this.router.navigate(['dashboard/car-cards', this.carData.id]);
      },
      error: (err) => {
        console.error('Error updating car', err);
      }
    });
  } else {
    // add car
    this.http.post('YOUR_CREATE_API_URL', formData).subscribe({
      next: (res) => {
        console.log('Car added successfully', res);
         this.router.navigate(['dashboard/car-cards']);
      },
      error: (err) => {
        console.error('Error adding car', err);
      }
    });
  }
}


  ngOnInit(): void {
  const navigation = history.state;
  if (navigation && navigation.car) {
    this.carData = navigation.car;
    this.formTitle = 'Update Car'; 
    this.prefillForm();
  }
}

prefillForm() {
  if (this.carData) {
    this.carForm.patchValue({
      car_id: this.carData.id || '',
      brand: this.carData.brand || '',
      model: this.carData.model || '',
      year: this.carData.year || '',
      license_plate: this.carData.license_plate || '',
      type: this.carData.type || '',
      transmission: this.carData.transmission || '',
      fuel_type: this.carData.fuel_type || '',
      seats: this.carData.seats || '',
      color: this.carData.color || '',
      mileage: this.carData.mileage || '',
      rental_rate_per_day: this.carData.rental_rate_per_day || '',
      rental_rate_per_hour: this.carData.rental_rate_per_hour || '',
      availability_status: this.carData.availability_status || '',
      current_location: this.carData.current_location || '',
      deposit_required: this.carData.deposit_required || '',
      insurance_status: this.carData.insurance_status || '',
      last_maintenance_date: this.carData.last_maintenance_date || '',
      next_maintenance_due: this.carData.next_maintenance_due || '',
      condition_notes: this.carData.condition_notes || '',
      fuel_level: this.carData.fuel_level || '',
      odometer_reading: this.carData.odometer_reading || '',
      date_added_to_fleet: this.carData.date_added_to_fleet || '',
      last_rented_date: this.carData.last_rented_date || '',
      expected_return_date: this.carData.expected_return_date || '',
      rating: this.carData.rating || '',
      rental_history: this.carData.rental_history || [],
      daily_rate: this.carData.daily_rate || '',
      hourly_rate: this.carData.hourly_rate || '',
      car_photos: this.carData.car_photos || null,
    });
  }
}

  
}
