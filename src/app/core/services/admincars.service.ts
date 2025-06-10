import { Injectable } from '@angular/core';
import { Cars } from '../../core/interfaces/cars';
import { Observable ,map} from 'rxjs'; 
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AdmincarsService {
   private _cars!: Cars[] 
  
   constructor(private http: HttpClient) { }

  getAllCars(): Observable<Cars[]> {
    return this.http.get<Cars[]>('http://localhost:5000/api/cars').pipe(
        map(cars => {
          this._cars = cars;
          return cars;
        })
      );
  }


    getAvailableCars(): Observable<Cars[]> {
    return this.getAllCars().pipe(
    map(cars => cars.filter(car => car.availabilityStatus === 'Available'))
    );
  }

  getOccupiedCars(): Observable<Cars[]> {
    return this.getAllCars().pipe(
    map(cars => cars.filter(car => car.availabilityStatus !== 'Available'))
  );
  }

 

  updateCar(carId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`http://localhost:5000/api/cars/${carId}`, formData);
  }

  addCar(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:5000/api/cars', formData);
  }

 
 
}
