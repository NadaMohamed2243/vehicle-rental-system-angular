import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { PriceRangeFilterComponent } from '../price-range-filter/price-range-filter.component';
import { CheckboxFilterComponentComponent } from '../checkbox-filter-component/checkbox-filter-component.component';
import { RadioFilterComponentComponent } from '../radio-filter-component/radio-filter-component.component';
import { FilterStateService } from '../../../../core/services/filter-state.service';
import { CarService } from '../../../../core/services/car.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    ToggleSwitchModule,
    DividerModule,
    AccordionModule,
    CheckboxModule,
    RadioButtonModule,
    InputNumberModule,
    PriceRangeFilterComponent,
    CheckboxFilterComponentComponent,
    RadioFilterComponentComponent,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit {
  searchText = '';
  availableNow = false;
  visible: boolean = false;
  selectedBrands: any[] = [];
  selectedBodyTypes: any[] = [];
  selectedTransmissionType: string | null = null;
  selectedFuelTypes: any[] = [];
  checked: boolean = false;
  brands: string[] = [];
  carBodyTypes: string[] = [];
  transmissionTypes: string[] = ['Any', 'Automatic', 'Manual'];
  fuelTypes: string[] = [];

  _carService = inject(CarService);

  _getBrands = this._carService.getPopularBrands().subscribe({
    next: (brands) => {
      this.brands = brands.map((brand) => brand.brand);
    },
    error: (err) => {
      console.error('Error loading brands:', err);
    },
  });

  _getBodyTypes = this._carService.getPopularTypes().subscribe({
    next: (bodyTypes) => {
      this.carBodyTypes = bodyTypes.map((type) => type.type);
    },
    error: (err) => {
      console.error('Error loading body types:', err);
    },
  });

  _getFuelTypes = this._carService.getFuelTypes().subscribe({
    next: (fuelTypes) => {
      this.fuelTypes = fuelTypes;
    },
    error: (err) => {
      console.error('Error loading fuel types:', err);
    },
  });

  ngOnInit(): void {
    this._getBrands;
    this._getBodyTypes;
  }

  filterState = inject(FilterStateService);

  onSearchChange() {
    this.filterState.updateFilters({ searchText: this.searchText });
  }

  onAvailabilityChange() {
    this.filterState.updateFilters({ availableNow: this.availableNow });
  }

  onPriceRangeChange(range: { min: number | null; max: number | null }) {
    this.filterState.updateFilters({ priceRange: range });
  }

  onBrandsChange(brands: string[]) {
    this.filterState.updateFilters({ brands });
  }

  onBodyTypesChange(bodyTypes: string[]) {
    this.filterState.updateFilters({ bodyTypes });
  }

  onTransmissionChange(transmission: string | null) {
    this.filterState.updateFilters({ transmission });
  }

  onFuelTypesChange(fuelTypes: string[]) {
    this.filterState.updateFilters({ fuelTypes });
  }

  resetAll() {
    this.searchText = '';
    this.availableNow = false;
    this.filterState.resetFilters();
    this.selectedBrands = [];
    this.selectedBodyTypes = [];
    this.selectedTransmissionType = 'Any';
    this.selectedFuelTypes = [];
    this.checked = false;
  }
}
