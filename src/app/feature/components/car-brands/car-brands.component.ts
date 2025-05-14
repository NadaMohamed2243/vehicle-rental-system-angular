import { Component, inject, OnInit } from '@angular/core';
import { CarsService } from '../../../core/services/cars.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-brands',
  imports: [],
  templateUrl: './car-brands.component.html',
  styleUrl: './car-brands.component.css',
})
export class CarBrandsComponent {
  popularBrands: { brand: string; count: number }[] = [];

  _carsService = inject(CarsService);
  _router = inject(Router);

  ngOnInit(): void {
    this.popularBrands = this._carsService.getPopularBrands();
  }

  viewCarsFromBrand(brand: string): void {
    this._router.navigate(['/cars'], { queryParams: { brand } });
  }

  // i don't know cars icon 2, 3,5,7 (should handel)
  getBrandLogo(brand: string): string {
    switch (brand.toLowerCase()) {
      case 'honda':
        return '/images/honda.png';
      case 'skoda':
        return '/icons/icon11.png';
      case 'Hyundai':
        return '/icons/icon10.png';
      case 'nissan':
        return '/icons/icon9.png';
      case 'ford':
        return '/icons/icon8.png';
      case 'chevrolet':
        return '/icons/icon6.png';
      case 'toyota':
        return '/icons/icon4.png';
      case 'audi':
        return '/icons/icon1.png';
      case 'bmw':
        return '/images/bmw.png';
      case 'mercedes':
        return '/images/mercedes.png';
      default:
        return '/images/logo2.png';
    }
  }
}
