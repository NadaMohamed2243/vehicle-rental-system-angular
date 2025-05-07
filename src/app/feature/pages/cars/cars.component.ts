import { Component, inject, OnInit } from '@angular/core';
import { Car } from '../../../core/interfaces/car';
import { CarsService } from '../../../core/services/cars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cars',
  imports: [CommonModule],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css',
})
export class CarsComponent implements OnInit {
  cars: Car[] = [];
  _carsService = inject(CarsService);
  _router = inject(Router);
  _route = inject(ActivatedRoute);
  filtration: string | null = null;
  type: string | null = null;

  ngOnInit(): void {
    // this.cars = this._carsService.getCars();

    // console.log(this.cars);
    // Correct way to subscribe to query params
    this._route.queryParams.subscribe((params) => {
      this.filtration = params['filtration'] || null;
      this.type = params['type'] || null; // Default to null if no 'type'
      console.log(this.filtration);
      console.log(this.type);
      this.loadCars();
    });
  }

  loadCars(): void {
    if (this.type) {
      // If both filtration and type are provided, filter cars accordingly
      this.cars = this._carsService.getCarsByType(this.type);
    } else if (this.filtration === 'most-popular') {
      // If only filtration is provided, filter by filtration criteria
      this.cars = this._carsService.getMostPopularCars();
    } else if (this.filtration === 'NearBy') {
      // If only filtration is provided, filter by filtration criteria
      this.cars = this._carsService.getNearByCars();
    } else if (this.filtration === 'all') {
      // If only filtration is provided, filter by filtration criteria
      this.cars = this._carsService.getCars();
    } else {
      // Otherwise, load all cars
      this.cars = this._carsService.getCars();
    }

    console.log(this.cars);
  }
}
