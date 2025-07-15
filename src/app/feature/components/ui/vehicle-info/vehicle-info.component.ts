import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cars } from '../../../../core/interfaces/cars';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-info',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">{{"FILTER.CAR_BRAND"|translate}}</p>
        <p class="text-sm">{{ selectedCar?.brand }}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">{{"FILTER.MODEL"|translate}}</p>
        <p class="text-sm">{{ selectedCar?.model }}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">{{"FILTER.YEAR"|translate}}</p>
        <p class="text-sm">{{ selectedCar?.year }}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">{{"FILTER.BODYSTYLE"|translate}}</p>
        <p class="text-sm">{{ selectedCar?.type }}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">{{"FILTER.TRANSMISSION"|translate}}</p>
        <p class="text-sm">{{ selectedCar?.transmission }}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">{{"FILTER.FUEL_TYPE"|translate}}</p>
        <p class="text-sm">{{ selectedCar?.fuel_type }}</p>
      </div>
    </div>
  `,
})
export class VehicleInfoComponent {
  @Input() selectedCar: Cars | null = null;
}
