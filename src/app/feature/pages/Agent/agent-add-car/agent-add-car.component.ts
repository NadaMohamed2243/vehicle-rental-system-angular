import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';    
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';  
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { OnInit } from '@angular/core';



@Component({
  selector: 'app-agent-add-car',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,InputTextModule,ButtonModule,MessageModule,FloatLabelModule,FileUploadModule,CalendarModule, RouterModule, HttpClientModule  ],
  templateUrl: './agent-add-car.component.html',
  styleUrls: ['./agent-add-car.component.css']
})


export class AgentAddCarComponent  implements OnInit {
  formTitle: string = 'Add New Car';
  carForm: FormGroup;
  mainImage: File | null = null;
  additionalImages: File[] = [];
  documents: File[] = [];
  documentsPreviews: string[] = [];
  imagePreview: string | null = null;
  additionalImagesPreviews: string[] = [];
  carId: string = '';
  


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {
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
      lastMaintenanceDate: [null],
      nextMaintenanceDue: [null],
      location: ['', Validators.required],
      availabilityStatus: ['', Validators.required],
      conditionNotes: [''],
      
    });
  }

  ngOnInit(): void {
  this.carForm.valueChanges.subscribe(value => {
    console.log('Live form changes:', value);       // Log the form values in real-time
  });

   this.route.paramMap.subscribe((params: ParamMap) => {
    const id = params.get('id');
    if (id) {
      this.carId = id;
      this.formTitle = 'Edit Car';
      this.loadCarData(id);
    }
  });
}

loadCarData(id: string): void {
  
  this.http.get<any>(`http://localhost:5000/api/cars/${id}`).subscribe({
    next: (car) => {
      this.carForm.patchValue({
        ...car,
        location: car.location || '', 
      });

      const images: string[] = [];
      const docs: string[] = [];

      (car.carPhotos || []).forEach((fileUrl: string) => {
        const ext = fileUrl.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp'].includes(ext!)) {
          images.push(fileUrl);
        } else if (['pdf', 'doc', 'docx'].includes(ext!)) {
          docs.push(fileUrl);
        }
      });

      this.imagePreview = images[0] || null;
      this.additionalImagesPreviews = images.slice(1);
      this.documentsPreviews = docs;

      // Reset selected files
      this.mainImage = null;
      this.additionalImages = [];
      this.documents = [];

      this.formTitle = 'Edit Car';
    },
    error: (err) => {
      console.error('Failed to load car data:', err);
    }
  });
}





  onImageSelected(event: any) {
    const file = event.files[0];
    if (file) {
      this.mainImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onAdditionalImagesSelected(event: any) {
    for (let file of event.files) {
      this.additionalImages.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        this.additionalImagesPreviews.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeAdditionalImage(preview: string) {
    const index = this.additionalImagesPreviews.indexOf(preview);
    if (index !== -1) {
      this.additionalImagesPreviews.splice(index, 1);
      this.additionalImages.splice(index, 1);
    }
  }

  onDocumentsSelected(event: any) {
    for (let file of event.files) {
      this.documents.push(file);
    }
  }


 


 submitForm() {
  console.log('Form submitted:', this.carForm.value);
  if (this.carForm.invalid) return;

  const formValues = this.carForm.value;
  const formData = new FormData();

  // car details
  formData.append('brand', formValues.brand);
  formData.append('model', formValues.model);
  formData.append('year', formValues.year.toString());
  formData.append('licensePlate', formValues.licensePlate);
  formData.append('type', formValues.type);
  formData.append('seats', formValues.seats.toString());
  formData.append('fuel_type', formValues.fuel_type);
  formData.append('color', formValues.color);
  formData.append('transmission', formValues.transmission);
  formData.append('odometerReading', formValues.odometerReading.toString());
  formData.append('totalPricePerDay', formValues.totalPricePerDay.toString());
  formData.append('totalPricePerHour', formValues.totalPricePerHour.toString());
  // formData.append('depositRequired', formValues.depositRequired.toString());
  // formData.append('with_driver', formValues.with_driver.toString());
  formData.append('availabilityStatus', formValues.availabilityStatus);
  formData.append('conditionNotes', formValues.conditionNotes || '');
  formData.append('location', formValues.location);

  if (formValues.lastMaintenanceDate) {
    formData.append('lastMaintenanceDate', new Date(formValues.lastMaintenanceDate).toISOString());
  }

  if (formValues.nextMaintenanceDue) {
    formData.append('nextMaintenanceDue', new Date(formValues.nextMaintenanceDue).toISOString());
  }

  // add agentId from localStorage
  // For demonstration, we will set a static agentId.

  localStorage.setItem('agentId', '665f18309d4f9e7123456755')

  const agentId = localStorage.getItem('agentId');
  if (agentId) {
    formData.append('agent', agentId);
  } else {
    console.error('agentId is missing from localStorage!');
  }


  // add images and documents
  let hasMainImage = false;
  // main image
  if (this.mainImage) {
    formData.append('carPhotos', this.mainImage); // index 0
     hasMainImage = true;
  }
// additional images
  this.additionalImages.forEach((img) => {
    formData.append('carPhotos', img); // index 1+
  });

  this.documents.forEach((doc) => {
  formData.append('documents', doc);
});


  // log the formData for debugging
  for (let pair of formData.entries()) {
    console.log(pair[0] + ':', pair[1]);
  }

  // send the formData to the server
 if (this.carId) {
  // edit
  this.http.put(`http://localhost:5000/api/cars/${this.carId}`, formData).subscribe({
    next: () => this.router.navigate(['/agent-dashboard/agent-car-cards']),
    error: err => console.error('Error updating car:', err)
  });
} else {
  //add
  this.http.post(`http://localhost:5000/api/cars`, formData).subscribe({
    next: () => this.router.navigate(['/agent-dashboard/agent-car-cards']),
    error: err => console.error('Error adding car:', err)
  });
}

}

}
