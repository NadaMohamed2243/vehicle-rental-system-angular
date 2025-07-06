import { Component, inject, input } from '@angular/core';
import { Cars } from '../../../../core/interfaces/cars';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CarService } from '../../../../core/services/car.service';

@Component({
  selector: 'app-card',
  imports: [StarRatingComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  carDetails = input<Cars>();
  fromWho = input<'landing' | 'home' | 'car'>();
  isFavorite = false;
  private _carService = inject(CarService);

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
  getTargetRoute() {
    const source = this.fromWho();
    const car = this.carDetails()!;
    this._carService.setSelectedCar(car);
    // return source === 'home' ? '/cars' : '/cars' ;
  }
}
