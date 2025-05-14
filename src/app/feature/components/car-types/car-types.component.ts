import { Component, inject, OnInit } from '@angular/core';
import { CarsService } from '../../../core/services/cars.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-types',
  imports: [],
  templateUrl: './car-types.component.html',
  styleUrl: './car-types.component.css',
})
export class CarTypesComponent implements OnInit {
  popularTypes: { type: string; count: number }[] = [];

  _carsService = inject(CarsService);
  _router = inject(Router);

  ngOnInit(): void {
    this.popularTypes = this._carsService.getPopularTypes();
  }

  viewCarsFromType(type: string): void {
    this._router.navigate(['/cars'], { queryParams: { type } });
  }



  getCarTypeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'pickup':
        return 'fa-solid fa-truck-pickup fa-2x';
      case 'sport':
      case 'sports car':
        return 'fa-solid fa-car-side fa-2x';
      case 'suv':
        return 'fa-solid fa-car-on fa-2x';
      case 'sedan':
        return 'fa-solid fa-car-rear fa-2x';
      case 'van':
        return 'fa-solid fa-shuttle-van fa-2x';
      default:
        return 'fas fa-car fa-2x';
    }
  }

}
