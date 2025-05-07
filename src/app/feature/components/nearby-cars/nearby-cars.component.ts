import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from '../../../core/interfaces/car';
import { CarsService } from '../../../core/services/cars.service';
import { CardCarouselComponent } from "../../../shared/components/ui/card-carousel/card-carousel.component";

@Component({
  selector: 'app-nearby-cars',
  imports: [CardCarouselComponent],
  templateUrl: './nearby-cars.component.html',
  styleUrl: './nearby-cars.component.css',
})
export class NearbyCarsComponent {
  cars!:Car[]
  _carsService=inject(CarsService)
  _router = inject(Router)
  ngOnInit(): void {
    this.cars=this._carsService.getNearByCars().slice(0, 10);
  }

  viewNearByCars() {
    this._router.navigate(['/cars'], {
      queryParams: { filtration: 'NearBy' }
    });
  }
}
