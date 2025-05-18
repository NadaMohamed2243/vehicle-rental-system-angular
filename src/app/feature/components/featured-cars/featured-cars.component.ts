import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardCarouselComponent } from "../../../shared/components/ui/card-carousel/card-carousel.component";
import { Cars } from '../../../core/interfaces/cars';
import { CarService } from '../../../core/services/car.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-cars',
  imports: [CardCarouselComponent, CommonModule],
  templateUrl: './featured-cars.component.html',
  styleUrls: ['./featured-cars.component.css']
})
export class FeaturedCarsComponent implements OnInit {
  cars: Cars[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  _carsService = inject(CarService);
  _router = inject(Router);

  ngOnInit(): void {
    this._carsService.getCars().subscribe({
      next: (cars) => {
        this.cars = cars.slice(0, 10);
        this.isLoading = false;
        this.errorMessage = null;
        console.log(cars)
      },
      error: (err) => {
        console.error('Error loading featured cars:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load featured cars. Please try again later.';
        this.cars = [];
      }
    });
  }

  viewAllCars() {
    this._router.navigate(['/cars'], {
      queryParams: { filtration: 'all' }
    });
  }
}
