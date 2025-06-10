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

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    FloatLabelModule,
    FileUploadModule,
    CalendarModule
  ],
  templateUrl: './agent-add-car.component.html',
  styleUrl: './agent-add-car.component.css'
})
export class AgentAddCarComponent {

  carForm: FormGroup;
  submitted = false;
  imagePreview: string | ArrayBuffer | null = null;
  additionalImagesPreviews: string[] = [];
  carData: any;
  formTitle: string = 'Add Car';

  constructor(private fb: FormBuilder, private _AdmincarService: AdmincarsService, private router: Router) {
    this.carForm = this.fb.group({
      _id: [''],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [null, [Validators.required, Validators.min(1990)]],
      licensePlate: ['', Validators.required],
      type: ['', Validators.required],
      transmission: ['', Validators.required],
      fuel_type: ['', Validators.required],
      seats: [null, [Validators.required, Validators.min(1)]],
      color: ['', Validators.required],
      mileage: [null, Validators.required],
      totalPricePerDay: [null, Validators.required],
      totalPricePerHour: [null, Validators.required],
      availabilityStatus: ['', Validators.required],
      current_location: ['', Validators.required],
      depositRequired: [null],
      insuranceStatus: [''],
      lastMaintenanceDate: [''],
      nextMaintenanceDue: [''],
      conditionNotes: [''],
      fuelLevel: [''],
      odometerReading: [null],
      date_added_to_fleet: [''],
      lastRentedDate: [''],
      expectedReturnDate: [''],
      rating: [null],
      rental_history: [[]],
      carPhotos: [null, Validators.required],
      additional_images: [null]
    });
  }

  onImageSelected(event: any) {
    const file = event.files?.[0] || event.target?.files?.[0];
    if (file) {
      this.carForm.patchValue({ carPhotos: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

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

    const mainImage: File = this.carForm.get('carPhotos')?.value;
    const additionalImages: File[] = Array.from(this.carForm.get('additional_images')?.value || []);

    const formData = new FormData();
    if (mainImage) {
      formData.append('images', mainImage);
    }
    additionalImages.forEach((file) => {
      formData.append('images', file);
    });

    this._AdmincarService.uploadImages(formData).subscribe({
      next: (res: any) => {
        const imageUrls: string[] = res.imageUrls || [];
        const carPhotos: string[] = imageUrls;

        const formDataToSend = { ...this.carForm.value };
        formDataToSend.carPhotos = carPhotos;

        if (this.carData) {
          this._AdmincarService.updateCar(this.carData._id, formDataToSend).subscribe({
            next: (res) => {
              this.router.navigate(['dashboard/car-cards']);
            },
            error: (err) => {
              console.error('Error updating car', err);
            }
          });
        } else {
          this._AdmincarService.addCar(formDataToSend).subscribe({
            next: (res) => {
              this.router.navigate(['dashboard/car-cards']);
            },
            error: (err) => {
              console.error('Error adding car', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error uploading images', err);
      }
    });
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
        _id: this.carData._id || '',
        brand: this.carData.brand || '',
        model: this.carData.model || '',
        year: this.carData.year || '',
        licensePlate: this.carData.licensePlate || '',
        type: this.carData.type || '',
        transmission: this.carData.transmission || '',
        fuel_type: this.carData.fuel_type || '',
        seats: this.carData.seats || '',
        color: this.carData.color || '',
        mileage: this.carData.mileage || '',
        availabilityStatus: this.carData.availabilityStatus || '',
        current_location: this.carData.current_location || '',
        depositRequired: this.carData.depositRequired || '',
        insuranceStatus: this.carData.insuranceStatus || '',
        lastMaintenanceDate: this.carData.lastMaintenanceDate || '',
        nextMaintenanceDue: this.carData.nextMaintenanceDue || '',
        conditionNotes: this.carData.conditionNotes || '',
        fuelLevel: this.carData.fuelLevel || '',
        odometerReading: this.carData.odometerReading || '',
        lastRentedDate: this.carData.lastRentedDate || '',
        expectedReturnDate: this.carData.expectedReturnDate || '',
        rating: this.carData.rating || '',
        rental_history: this.carData.rental_history || [],
        totalPricePerDay: this.carData.totalPricePerDay || '',
        totalPricePerHour: this.carData.totalPricePerHour || '',
        carPhotos: this.carData.carPhotos || null
      });

      if (this.carData.carPhotos) {
        if (Array.isArray(this.carData.carPhotos) && this.carData.carPhotos.length > 0) {
          this.imagePreview = this.carData.carPhotos[0];
        } else if (typeof this.carData.carPhotos === 'string') {
          this.imagePreview = this.carData.carPhotos;
        }
      }

      if (this.carData.additional_images && Array.isArray(this.carData.additional_images)) {
        this.additionalImagesPreviews = this.carData.additional_images.map((img: string) => img);
      } else if (typeof this.carData.additional_images === 'string') {
        this.additionalImagesPreviews = [this.carData.additional_images];
      }
    }
  }
}
