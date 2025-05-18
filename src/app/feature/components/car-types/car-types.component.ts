import { Component, inject, OnInit } from '@angular/core';
import { CarService } from '../../../core/services/car.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-types',
  imports: [CommonModule],
  templateUrl: './car-types.component.html',
  styleUrls: ['./car-types.component.css']
})
export class CarTypesComponent implements OnInit {
  popularTypes: { type: string; count: number }[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  _carService = inject(CarService);
  _router = inject(Router);

  ngOnInit(): void {
    this._carService.getPopularTypes().subscribe({
      next: (types) => {
        this.popularTypes = types;
        this.isLoading = false;
        this.errorMessage = null;
        console.log(types)
      },
      error: (err) => {
        console.error('Error loading car types:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load car types. Please try again later.';
        this.popularTypes = [];
      }
    });
  }

  viewCarsFromType(type: string): void {
    this._router.navigate(['/cars'], { queryParams: { type } });
  }

  getCarTypeIcon(type: string): string {
    const typeLower = type.toLowerCase();
    const iconMap: {[key: string]: string} = {
      'pickup': 'fa-solid fa-truck-pickup fa-2x',
      'sport': 'fa-solid fa-car-side fa-2x',
      'sports car': 'fa-solid fa-car-side fa-2x',
      'suv': 'fa-solid fa-car-on fa-2x',
      'sedan': 'fa-solid fa-car-rear fa-2x',
      'van': 'fa-solid fa-shuttle-van fa-2x',
      'limousine': 'fa-solid fa-car-tunnel fa-2x',
      'hatchback': 'fa-solid fa-car-side fa-2x',
      'coupe': 'fa-solid fa-car-side fa-2x',
      'convertible': 'fa-solid fa-car-side fa-2x'
    };

    return iconMap[typeLower] || 'fas fa-car fa-2x';
  }
}
