import { inject, Injectable } from '@angular/core';
import { Cars } from '../../core/interfaces/cars';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private _cars: Cars[] = [];
  private _popularCars: Cars[] = [];
  private _nearbyCars: Cars[] = [];

  _userService = inject(UserService);
  userCity: string = '';

  constructor(private http: HttpClient) {}

  // Fetch all cars from API
  getCars(): Observable<Cars[]> {
    return this.http.get<Cars[]>('http://localhost:5000/api/cars').pipe(
      map(cars => {
        this._cars = cars;
        return cars;
      })
    );
  }

  // Get popular cars (sorted by rating)
  getMostPopularCars(): Observable<Cars[]> {
    return this.getCars().pipe(
      map(cars => {
        this._popularCars = [...cars]
          .filter((car) => (car.rating || 0) > 3.5)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0));
        return this._popularCars;
      })
    );
  }

  // Get nearby cars based on user's city
  getNearByCars(): Observable<Cars[]> {
    this.userCity = this._userService.getUser().location.city;
    return this.getCars().pipe(
      map(cars => {
        this._nearbyCars = cars.filter(
          (car) => car.exhibition?.location.toLowerCase() === this.userCity.toLowerCase()
        );
        return this._nearbyCars;
      })
    );
  }

  // Get popular car types
  getPopularTypes(): Observable<{ type: string; count: number }[]> {
    return this.getCars().pipe(
      map(cars => {
        const typeCounts: { [key: string]: number } = {};

        cars.forEach((car) => {
          if (typeCounts[car.type]) {
            typeCounts[car.type]++;
          } else {
            typeCounts[car.type] = 1;
          }
        });

        return Object.entries(typeCounts)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count);
      })
    );
  }

  // Get cars by type
  getCarsByType(type: string): Observable<Cars[]> {
    return this.getCars().pipe(
      map(cars => cars.filter((car) => car.type === type))
    );
  }

  // Get popular car brands
  getPopularBrands(): Observable<{ brand: string; count: number }[]> {
    return this.getCars().pipe(
      map(cars => {
        const brandCounts: { [key: string]: number } = {};

        cars.forEach((car) => {
          if (brandCounts[car.brand]) {
            brandCounts[car.brand]++;
          } else {
            brandCounts[car.brand] = 1;
          }
        });

        return Object.entries(brandCounts)
          .map(([brand, count]) => ({ brand, count }))
          .sort((a, b) => b.count - a.count);
      })
    );
  }

  // Get cars by brand
  getCarsByBrand(brand: string): Observable<Cars[]> {
    return this.getCars().pipe(
      map(cars => cars.filter((car) => car.brand === brand))
    );
  }
}
