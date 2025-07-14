import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { Observable } from 'rxjs';

import { AdmincarsService } from '../../../../core/services/admincars.service';
import { HttpClient } from '@angular/common/http';
import { UserHeaderComponent } from '../../user-header/user-header.component';


@Component({
  selector: 'app-agent-add-car',
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
    CalendarModule,
    DropdownModule,
    UserHeaderComponent
  ],
  templateUrl: './agent-add-car.component.html',
  styleUrls: ['./agent-add-car.component.css']
})
export class AgentAddCarComponent implements OnInit {
  formTitle = 'Add New Car';
  carForm!: FormGroup;

  mainImage: File | null = null;
  additionalImages: File[] = [];
  documents: File[] = [];

  imagePreview: string | null = null;
  additionalImagesPreviews: string[] = [];
   documentsPreviews: string[] = [];


  carId = '';
  transmissionOptions = [
  { label: 'Automatic', value: 'Automatic' },
  { label: 'Manual', value: 'Manual' }
];

fuelTypeOptions = [
  { label: 'Petrol', value: 'Petrol' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Electric', value: 'Electric' },
  { label: 'Hybrid', value: 'Hybrid' }
];

availabilityOptions = [
  { label: 'Available', value: 'Available' },
  { label: 'Rented', value: 'Rented' }
];

categoryOptions = [
  { label: 'Wedding', value: 'widding' },
  { label: 'Day Use', value: 'Day Use' },
  { label: 'Trip', value: 'Trip' },
  { label: 'Business', value: 'business' },
  { label: 'Airport Pickup', value: 'Airport Pickup' },
  { label: 'Economy', value: 'Economy' },
  { label: 'Other', value: 'other' }
];

seatOptions = Array.from({ length: 7 }, (_, i) => {
  const seat = i + 2;
  return { label: `${seat} Seats`, value: seat };
});

colorOptions = [
  { label: 'White', value: 'White' },
  { label: 'Black', value: 'Black' },
  { label: 'Gray', value: 'Gray' },
  { label: 'Silver', value: 'Silver' },
  { label: 'Red', value: 'Red' },
  { label: 'Blue', value: 'Blue' },
  { label: 'Green', value: 'Green' },
  { label: 'Yellow', value: 'Yellow' },
  { label: 'Other', value: 'Other' }
];

yearOptions = Array.from({ length: 11 }, (_, i) => {
  const year = 2015 + i;
  return { label: `${year}`, value: year };
});

brandsOptions = [
  { label: 'Ferrari', value: 'Ferrari' },
  { label: 'BMW', value: 'BMW' },
  { label: 'Mercedes', value: 'Mercedes' },
  { label: 'Honda', value: 'Honda' },
  { label: 'Nissan', value: 'Nissan' },
  { label: 'Toyota', value: 'Toyota' },
  { label: 'Test', value: 'Test' },
  { label: 'After Ava Test', value: 'afteravatest' },
];

typeOptions = [
  { label: 'Sport', value: 'sport' },
  { label: 'SUV', value: 'SUV' },
  { label: 'Sedan', value: 'Sedan' },
  { label: 'Hatchback', value: 'hatchback' },
  { label: 'Convertible', value: 'convertible' },
  { label: 'Pickup', value: 'pickup' },
  { label: 'Test', value: 'test' },
];




  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private adminCarsService: AdmincarsService
  ) {
    this.buildForm();
  }

  // ---------- init ----------
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id) {
        this.carId = id;
        this.formTitle = 'Edit Car';
        this.loadCarData(id);
      }
    });
  }

  // ---------- build form ----------
  private buildForm(): void {
    this.carForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      licensePlate: ['', Validators.required],
      type: ['', Validators.required],
      seats: ['', Validators.required],
      fuel_type: ['', Validators.required],
      color: ['', Validators.required],
      transmission: ['', Validators.required],
      odometerReading: ['', Validators.required],
      totalPricePerDay: ['', Validators.required],
      totalPricePerHour: ['', Validators.required],
      lastMaintenanceDate: null,
      nextMaintenanceDue: null,
      availabilityStatus: ['', Validators.required],
      allowedCategories: ['', Validators.required],
      conditionNotes: ''
    });
  }

  // ---------- load existing ----------
  private loadCarData(id: string): void {
    this.adminCarsService.getCar(id).subscribe({
      next: car => {
        this.carForm.patchValue(car);

        //previews
        const imgs: string[] = [];
        const docs: string[] = [];

        (car.carPhotos || []).forEach(url => {
          const ext = url.split('.').pop()!.toLowerCase();
          (['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? imgs : docs).push(url);
        });

        this.imagePreview = imgs[0] || null;
        this.additionalImagesPreviews = imgs.slice(1);
        this.documentsPreviews = docs;
      },
      error: err => console.error('Failed to load car', err)
    });
  }

  // ---------- file handlers ----------
 onImageSelected(event: Event): void {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) {
    this.mainImage = file; 
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}


 onAdditionalImagesSelected(event: Event) {
  const files = (event.target as HTMLInputElement)?.files;
  if (files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.additionalImagesPreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }
}

// ---------- documents ----------

onDocumentsSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files) return;

  this.documentsPreviews = [];

  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.documentsPreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  });
  console.log('Documents selected:', this.documentsPreviews);
}


removeDocument(preview: string) {
  this.documentsPreviews = this.documentsPreviews.filter(p => p !== preview);
}



  removeAdditionalImage(url: string) {
    const idx = this.additionalImagesPreviews.indexOf(url);
    if (idx > -1) {
      this.additionalImagesPreviews.splice(idx, 1);
      this.additionalImages.splice(idx, 1);
    }
  }

  // ---------- submit ----------
  submitForm(): void {
    if (this.carForm.invalid) {
    this.carForm.markAllAsTouched(); 
    return;
  }

    //Build FormData
    const fd = new FormData();
    Object.entries(this.carForm.value).forEach(([k, v]) => {
  if (v !== null && v !== undefined) {
    // If the value is an object with a `value` field (like a dropdown), extract it
    const valueToAppend: string = typeof v === 'object' && v !== null && 'value' in v ? (v as any).value : String(v);
    fd.append(k, valueToAppend);
  }
});

    // images/files
    if (this.mainImage) fd.append('carPhotos', this.mainImage);
    this.additionalImages.forEach(f => fd.append('carPhotos', f));
    this.documents.forEach(f => fd.append('documents', f));

    // agent id
    const agentId = localStorage.getItem('agentId');
    if (agentId) fd.append('agent', agentId);

    const done = () => this.router.navigate(['/agent-dashboard/agent-car-cards']);

    if (this.carId) {
      // UPDATE
      this.adminCarsService.updateCar(this.carId, fd).subscribe({
        next: done,
        error: err => console.error('Error updating car:', err)
      });
    } else {
      // ADD
      this.adminCarsService.addCar(fd).subscribe({
        next: done,
        error: err => console.error('Error adding car:', err)
      });
    }
  }
}

