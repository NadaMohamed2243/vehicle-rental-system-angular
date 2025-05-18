import { Injectable } from '@angular/core';
import { Cars } from '../../core/interfaces/cars';
import { Observable, of ,map} from 'rxjs'; //use it until i use httpClient (get data from api), when i use it i will remove it
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
    return of(this._cars.filter(car => car.availabilityStatus === 'Available'));
  }

  getOccupiedCars(): Observable<Cars[]> {
    return of(this._cars.filter(car => car.availabilityStatus !== 'Available'));
  }

 


 updateCar(carId: number, formData: FormData): Observable<any> {
  const updatedCar: any = {};  

  formData.forEach((value, key) => {
    updatedCar[key] = value;  
  });

  const carIndex = this._cars.findIndex(car => car._id === carId.toString());
  if (carIndex !== -1) {
    this._cars[carIndex] = { ...this._cars[carIndex], ...updatedCar };
    return of({ success: true, message: 'Car updated successfully', car: this._cars[carIndex] });
  }
  return of({ success: false, message: 'Car not found' });
}

//addCar method
addCar(formData: FormData): Observable<any> {
  const newCar: any = {};  

  formData.forEach((value, key) => {
    newCar[key] = value;  
  });

  newCar['id'] = this._cars.length + 1;
  this._cars.push(newCar);  

  return of({ success: true, message: 'Car added successfully', car: newCar });
}


 
}
