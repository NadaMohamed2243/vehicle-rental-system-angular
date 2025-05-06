import { Component, inject, OnInit } from '@angular/core';
import { CardCarouselComponent } from "../../../shared/components/ui/card-carousel/card-carousel.component";
import { Car } from '../../../core/interfaces/car';
import { CarsService } from '../../../core/services/cars.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured-cars',
  imports: [CardCarouselComponent,RouterLink],
  templateUrl: './featured-cars.component.html',
  styleUrl: './featured-cars.component.css'
})
export class FeaturedCarsComponent implements OnInit {
  cars!:Car[]
  _carsService=inject(CarsService)

  ngOnInit(): void {
    this.cars=this._carsService.getCars();
  }
}
