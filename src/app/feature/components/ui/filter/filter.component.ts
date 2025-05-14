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
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  visible: boolean = false;
  selectedBrands: any[] = [];
  selectedBodyTypes: any[] = [];
  selectedTransmissionTypes: any[] = [];
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
  carBodyTypes: String[] = [
    'Sedan',
    'Hatchback',
    'Coupe',
    'Convertible',
    'Wagon',
    'Sports Car',
  ];
  transmissionTypes: String[] = ['Any', 'Automatic', 'Manual'];
  fuelTypes: String[] = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];

  onPriceRangeChange(range: { min: number | null; max: number | null }) {
    console.log('Price range changed:', range);
  }

  onSelectedItemsChange(items: string[]) {
    console.log('Selected items:', items);
  }
}
