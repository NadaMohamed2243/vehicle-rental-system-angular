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
import { Observable } from 'rxjs';

import { AdmincarsService } from '../../../../core/services/admincars.service';
import { HttpClient } from '@angular/common/http';

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
    CalendarModule
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
  onImageSelected(e: any) {
    const file = e.files?.[0];
    if (!file) return;
    this.mainImage = file;
    const rd = new FileReader();
    rd.onload = () => (this.imagePreview = rd.result as string);
    rd.readAsDataURL(file);
  }

 onAdditionalImagesSelected(e: any) {
  const files = Array.from(e.files as File[]);
  files.forEach(f => {
    this.additionalImages.push(f);
    const rd = new FileReader();
    rd.onload = () => this.additionalImagesPreviews.push(rd.result as string);
    rd.readAsDataURL(f);
  });
}


  onDocumentsSelected(e:any){
  const files:File[] = Array.from(e.files || e.target?.files || []);
  files.forEach(f => this.documents.push(f));
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
    if (this.carForm.invalid) return;

    //Build FormData 
    const fd = new FormData();
    Object.entries(this.carForm.value).forEach(
      ([k, v]) => v !== null && fd.append(k, v as any)
    );

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

