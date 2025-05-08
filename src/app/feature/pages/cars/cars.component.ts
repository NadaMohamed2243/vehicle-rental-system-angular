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
  brand: string | null = null;

  ngOnInit(): void {
    // this.cars = this._carsService.getCars();

    // console.log(this.cars);
    this._route.queryParams.subscribe((params) => {
      this.filtration = params['filtration'] || null;
      this.type = params['type'] || null;
      this.brand = params['brand'] || null;
      console.log(this.filtration);
      console.log(this.type);
      console.log(this.brand);
      this.loadCars();
    });
  }

  loadCars(): void {
    if (this.type) {

      this.cars = this._carsService.getCarsByType(this.type);
    } else if (this.brand) {

      this.cars = this._carsService.getCarsByBrand(this.brand);
    }else if (this.filtration === 'most-popular') {

      this.cars = this._carsService.getMostPopularCars();
    } else if (this.filtration === 'NearBy') {

      this.cars = this._carsService.getNearByCars();
    } else if (this.filtration === 'all') {

      this.cars = this._carsService.getCars();
    } else {

      this.cars = this._carsService.getCars();
    }

    console.log(this.cars);
  }
}
