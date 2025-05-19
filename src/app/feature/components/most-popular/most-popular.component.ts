import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cars } from '../../../core/interfaces/cars';
import { CarService } from '../../../core/services/car.service';
import { CardCarouselComponent } from '../../../shared/components/ui/card-carousel/card-carousel.component';
import { CommonModule } from '@angular/common';
import { get } from 'http';

@Component({
  selector: 'app-most-popular',
  imports: [CardCarouselComponent, CommonModule],
  templateUrl: './most-popular.component.html',
  styleUrl: './most-popular.component.css',
})
export class MostPopularComponent implements OnInit {
  cars: Cars[] = [];
  isLoading = true;
  _carService = inject(CarService);
  _router = inject(Router);

  ngOnInit(): void {
    this.getCars();
  }

  viewMostPopularCars() {
    this._router.navigate(['/cars'], {
      queryParams: { filtration: 'most-popular' },
    });
  }

  getCars() {
    this._carService.getMostPopularCars().subscribe({
      next: (data) => {
        this.cars = data.slice(0, 10);
        console.log(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading popular cars:', err);
        this.isLoading = false;
      },
    });
  }
}
