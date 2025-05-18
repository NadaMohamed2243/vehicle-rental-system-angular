import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { Router } from '@angular/router';
import { AdmincarsService } from '../../../../core/services/admincars.service';
import { Car } from '../../../../core/interfaces/car';


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



  constructor(private fb: FormBuilder, private _AdmincarService:AdmincarsService ,private router: Router) {
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
      totalPricePerDay: [null, Validators.required],
      totalPricePerHour: [null, Validators.required],
      availability_status: ['', Validators.required],
      current_location: ['', Validators.required],
      deposit_required: [null],
      insurance_status: [''],
      lastMaintenanceDate: [''],
      nextMaintenanceDue: [''],
      condition_notes: [''],
      fuel_level: [''],
      odometer_reading: [null],
      date_added_to_fleet: [''],
      last_rented_date: [''],
      expected_return_date: [''],
      rating: [null],
      rental_history: [[]],
      car_photos: [null, Validators.required],
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
    const formData = new FormData();
    Object.entries(this.carForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
          if (value instanceof Blob) {
          formData.append(key, value);
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      }
    });

    if (this.carData) {
      // editing an existing car
      this._AdmincarService.updateCar(this.carData.id, formData).subscribe({
        next: (res:any) => {
          console.log('Car updated successfully', res);
          this.router.navigate(['dashboard/car-cards']);
          
        },
        error: (err: any) => {
          console.error('Error updating car', err);
        }
      });
    } else {
      // adding a new car
      this._AdmincarService.addCar(formData).subscribe({
        next: (res :any) => {
          console.log('Car added successfully', res);
          this.router.navigate(['dashboard/car-cards']);
        },
        error: (err:any) => {
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
      lastMaintenanceDate: this.carData.lastMaintenanceDate || '',
      nextMaintenanceDue: this.carData.nextMaintenanceDue || '',
      condition_notes: this.carData.condition_notes || '',
      fuel_level: this.carData.fuel_level || '',
      odometer_reading: this.carData.odometer_reading || '',
      date_added_to_fleet: this.carData.date_added_to_fleet || '',
      last_rented_date: this.carData.last_rented_date || '',
      expected_return_date: this.carData.expected_return_date || '',
      rating: this.carData.rating || '',
      rental_history: this.carData.rental_history || [],
      totalPricePerDay: this.carData.totalPricePerDay || '',
      totalPricePerHour: this.carData.totalPricePerHour || '',
      car_photos: this.carData.car_photos || null,
    });
  }
}

  
}
