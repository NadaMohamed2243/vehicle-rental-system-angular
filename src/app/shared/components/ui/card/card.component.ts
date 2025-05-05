import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Car } from '../../../../core/interfaces/car';
import { StarRatingComponent } from "../star-rating/star-rating.component";


@Component({
  selector: 'app-card',
  imports: [RouterLink, RouterLinkActive, StarRatingComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  carDetails = input<Car>()
  fromWho = input<any>()
  isFavorite = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}
