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

  ngOnInit(): void {
    this.cars = this._carsService.getCars();

    console.log(this.cars);
    // Correct way to subscribe to query params
    this._route.queryParams.subscribe((params) => {
      const attribute = params['filtration'] || 'all';
      console.log(attribute);
    });
  }
}
