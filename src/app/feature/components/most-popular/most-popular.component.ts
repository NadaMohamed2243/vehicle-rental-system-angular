import { Component, inject, OnInit } from '@angular/core';
import { Car } from '../../../core/interfaces/car';
import { CarsService } from '../../../core/services/cars.service';
import { Router } from '@angular/router';
import { CardCarouselComponent } from "../../../shared/components/ui/card-carousel/card-carousel.component";

@Component({
  selector: 'app-most-popular',
  imports: [CardCarouselComponent],
  templateUrl: './most-popular.component.html',
  styleUrl: './most-popular.component.css',
})
export class MostPopularComponent implements OnInit{
  cars!:Car[]
  _carsService=inject(CarsService)
  _router = inject(Router)
  ngOnInit(): void {
    this.cars=this._carsService.getMostPopularCars().slice(0, 10);
  }

  viewMostPopularCars() {
    this._router.navigate(['/cars'], {
      queryParams: { filtration: 'most-popular' }
    });
  }
}
