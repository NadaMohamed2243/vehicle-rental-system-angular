import { Component, inject, OnInit } from '@angular/core';
import { CarService } from '../../../core/services/car.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-brands',
  imports: [CommonModule],
  templateUrl: './car-brands.component.html',
  styleUrls: ['./car-brands.component.css']
})
export class CarBrandsComponent implements OnInit {
  popularBrands: { brand: string; count: number }[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  _carService = inject(CarService);
  _router = inject(Router);

  ngOnInit(): void {
    this._carService.getPopularBrands().subscribe({
      next: (brands) => {
        this.popularBrands = brands;
        this.isLoading = false;
        this.errorMessage = null;
      },
      error: (err) => {
        console.error('Error loading brands:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load car brands. Please try again later.';
      }
    });
  }

  viewCarsFromBrand(brand: string): void {
    this._router.navigate(['/cars'], { queryParams: { brand } });
  }

  getBrandLogo(brand: string): string {
    const brandLower = brand.toLowerCase();
    const logoMap: {[key: string]: string} = {
      'honda': '/images/honda.png',
      'skoda': '/icons/icon11.png',
      'hyundai': '/icons/icon10.png',
      'nissan': '/icons/icon9.png',
      'ford': '/icons/icon8.png',
      'chevrolet': '/icons/icon6.png',
      'toyota': '/icons/icon4.png',
      'audi': '/icons/icon1.png',
      'bmw': '/images/bmw.png',
      'mercedes': '/images/mercedes.png',
      'ferrari': '/images/ferrari.png',
      'volkswagen': '/images/vw.png',
      'kia': '/images/kia.png',
      'mazda': '/images/mazda.png'
    };

    return logoMap[brandLower] || '/images/logo2.png';
  }
}
