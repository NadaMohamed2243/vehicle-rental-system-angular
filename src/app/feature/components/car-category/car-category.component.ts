import { Component, inject, OnInit } from '@angular/core';
import { CarService } from '../../../core/services/car.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-car-category',
  imports: [TranslateModule],
  templateUrl: './car-category.component.html',
  styleUrl: './car-category.component.css',
})
export class CarCategoryComponent implements OnInit {
  categories: { category: string; count: number }[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  _carService = inject(CarService);
  _router = inject(Router);

  ngOnInit(): void {
    this.getFinalCars();
  }

  getFinalCars() {
    this._carService.getPopularCategories().subscribe({
      next: (category) => {
        this.categories = category;
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error loading car category:', err);
        this.isLoading = false;
        this.errorMessage =
          'Failed to load car category. Please try again later.';
        this.categories = [];
      },
    });
  }

  viewCarsFromCategory(category: string): void {
    this._router.navigate(['/cars'], { queryParams: { category } });
  }

  getCarCategoryImage(category: string): string {
    const typeLower = category.toLowerCase();

    switch (typeLower) {
      case 'wedding':
        return '/images/category/wedding.jpg';
      case 'day use':
        return '/images/category/day_use.jpg';
      case 'trip':
        return '/images/category/trip.jpg';
      case 'business':
        return '/images/category/business.jpg';
      case 'airport pickup':
        return '/images/category/Airport_Pickup.jpg';
      case 'economy':
        return '/images/category/economy.jpg';
      case 'other':
        return '/images/category/other.jpg';
      default:
        return '/images/category/other.png';
    }
  }
}
