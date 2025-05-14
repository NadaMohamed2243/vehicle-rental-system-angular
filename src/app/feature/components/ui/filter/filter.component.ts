import { Component } from '@angular/core';
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
export class FilterComponent {
  visible: boolean = false;
  selectedBrands: any[] = [];
  selectedBodyTypes: any[] = [];
  selectedTransmissionType: string | null = null;
  selectedFuelTypes: any[] = [];
  checked: boolean = false;
  brands: string[] = [
    'Toyota',
    'Volkswagen',
    'Ford',
    'Honda',
    'Chevrolet',
    'Nissan',
    'Hyundai',
    'Kia',
    'BMW',
    'Mercedes',
  ];
  carBodyTypes: string[] = [
    'Sedan',
    'Hatchback',
    'Coupe',
    'Convertible',
    'Wagon',
    'Sports Car',
  ];
  transmissionTypes: string[] = ['Any', 'Automatic', 'Manual'];
  fuelTypes: string[] = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];

  onPriceRangeChange(range: { min: number | null; max: number | null }) {
    console.log('Price range changed:', range);
  }

  onSelectedItemsChange(items: string[]) {
    console.log('Selected items:', items);
  }
  onSelectedItemChange(item: string | null) {
    console.log('Selected items:', item);
  }
}
