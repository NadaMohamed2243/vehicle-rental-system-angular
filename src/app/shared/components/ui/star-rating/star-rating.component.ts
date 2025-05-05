import { CommonModule } from '@angular/common';
import { Component, input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent implements OnChanges{
  rating = input<number>()
  stars: ('full' | 'half' | 'empty')[] = [];
  showText="true"
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rating']) {
      this.calculateStars();
    }
  }

  private calculateStars() {
    const currentRating = this.rating();
    const safeRating = currentRating ?? 0;
    const roundedRating = Math.round(safeRating * 2) / 2; // Round to nearest 0.5
    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating % 1 !== 0;

    this.stars = Array(5).fill('empty')
      .map((_, i) => {
        if (i < fullStars) return 'full';
        if (i === fullStars && hasHalfStar) return 'half';
        return 'empty';
      });
  }
}
