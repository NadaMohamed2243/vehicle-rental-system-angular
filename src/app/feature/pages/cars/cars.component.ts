import { Component, inject, OnInit } from '@angular/core';
import { Cars } from '../../../core/interfaces/cars';
import { CarService } from '../../../core/services/car.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
  cars: Cars[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  _carsService = inject(CarService);
  _router = inject(Router);
  _route = inject(ActivatedRoute);

  filtration: string | null = null;
  type: string | null = null;
  brand: string | null = null;

  ngOnInit(): void {
    this._route.queryParams.pipe(
      switchMap(params => {
        this.filtration = params['filtration'] || null;
        this.type = params['type'] || null;
        this.brand = params['brand'] || null;

        console.log('Query params:', {
          filtration: this.filtration,
          type: this.type,
          brand: this.brand
        });

        return this.loadCars();
      })
    ).subscribe({
      next: (cars) => {
        this.cars = cars;
        this.isLoading = false;
        this.errorMessage = null;
        console.log('Loaded cars:', this.cars);
      },
      error: (err) => {
        console.error('Error loading cars:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load cars. Please try again later.';
        this.cars = [];
      }
    });
  }

  loadCars(): Observable<Cars[]> {
    this.isLoading = true;
    this.errorMessage = null;

    if (this.type) {
      return this._carsService.getCarsByType(this.type);
    } else if (this.brand) {
      return this._carsService.getCarsByBrand(this.brand);
    } else if (this.filtration === 'most-popular') {
      return this._carsService.getMostPopularCars();
    } else if (this.filtration === 'NearBy') {
      return this._carsService.getNearByCars();
    } else {
      return this._carsService.getCars();
    }
  }
}
