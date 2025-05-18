import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-price-range-filter',
  imports: [FormsModule],
  templateUrl: './price-range-filter.component.html',
  styleUrl: './price-range-filter.component.css',
})
export class PriceRangeFilterComponent {
  minPrice: number = 0;
  maxPrice: number = 100000;

  @Output() priceChange = new EventEmitter<{
    min: number | null;
    max: number | null;
  }>();

  onPriceChange() {
    this.priceChange.emit({
      min: this.minPrice,
      max: this.maxPrice,
    });
  }
}
