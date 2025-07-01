import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Cars } from '../../../../core/interfaces/cars';
import { StarRatingComponent } from "../star-rating/star-rating.component";


@Component({
  selector: 'app-card',
  imports: [RouterLink, StarRatingComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  carDetails = input<Cars>()
  fromWho = input<'landing' | 'home' | 'car'>()
  isFavorite = false;

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
  getTargetRoute(): string {
    const source = this.fromWho();
    return source === 'home' ? '/cars' : '/cars' ;
  }
}
