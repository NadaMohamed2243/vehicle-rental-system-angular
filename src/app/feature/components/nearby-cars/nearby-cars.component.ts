import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cars } from '../../../core/interfaces/cars';
import { CarService } from '../../../core/services/car.service';
import { CardCarouselComponent } from "../../../shared/components/ui/card-carousel/card-carousel.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nearby-cars',
  imports: [CardCarouselComponent, CommonModule],
  templateUrl: './nearby-cars.component.html',
  styleUrls: ['./nearby-cars.component.css']
})
export class NearbyCarsComponent implements OnInit {
  cars: Cars[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  userCity: string = '';

  _carsService = inject(CarService);
  _router = inject(Router);

  ngOnInit(): void {
    this.loadNearbyCars();
  }

  loadNearbyCars(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this._carsService.getNearByCars().subscribe({
      next: (cars) => {
        this.cars = cars.slice(0, 10);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading nearby cars:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load nearby cars. Please try again later.';
        this.cars = [];
      }
    });
  }

  viewNearByCars() {
    this._router.navigate(['/cars'], {
      queryParams: { filtration: 'NearBy' }
    });
  }
}
