import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface FilterState {
  searchText: string;
  priceRange: { min: number | null; max: number | null };
  brands: string[];
  bodyTypes: string[];
  transmission: string | null;
  fuelTypes: string[];
  availableNow: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FilterStateService {
  private _filters = new BehaviorSubject<FilterState>({
    searchText: '',
    priceRange: { min: null, max: null },
    brands: [],
    bodyTypes: [],
    transmission: null,
    fuelTypes: [],
    availableNow: false,
  });
  currentFilters$ = this._filters.asObservable();

  updateFilters(newFilters: Partial<FilterState>) {
    this._filters.next({
      ...this._filters.value,
      ...newFilters,
    });
  }
  resetFilters() {
    this._filters.next({
      searchText: '',
      availableNow: false,
      priceRange: { min: null, max: null },
      brands: [],
      bodyTypes: [],
      transmission: null,
      fuelTypes: [],
    });
  }
  constructor() {}
}
