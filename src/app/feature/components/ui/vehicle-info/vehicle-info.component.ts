import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cars } from '../../../../core/interfaces/cars';

@Component({
  selector: 'app-vehicle-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-3">
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">Brand</p>
        <p class="text-sm">{{ selectedCar?.brand }}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">Model</p>
        <p class="text-sm">{{ selectedCar?.model }}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">Year</p>
        <p class="text-sm">{{ selectedCar?.year }}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">Body Style</p>
        <p class="text-sm">{{ selectedCar?.type }}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">Transmission</p>
        <p class="text-sm">{{ selectedCar?.transmission }}</p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-sm font-bold">Fuel Type</p>
        <p class="text-sm">{{ selectedCar?.fuel_type }}</p>
      </div>
    </div>
  `,
})
export class VehicleInfoComponent {
  @Input() selectedCar: Cars | null = null;
}
