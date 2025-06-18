import { Injectable } from '@angular/core';
import { Cars } from '../../core/interfaces/cars';
import { Observable, map } from 'rxjs'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdmincarsService {
  private _cars!: Cars[];

  constructor(private http: HttpClient) {}

  // Generate headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllCars(): Observable<Cars[]> {
    return this.http.get<Cars[]>('http://localhost:5000/api/agent/cars', {
      headers: this.getAuthHeaders()
    }).pipe(
      map(cars => {
        this._cars = cars;
        return cars;
      })
    );
  }

  getCar(id: string): Observable<Cars> {
  return this.http.get<Cars>(`http://localhost:5000/api/agent/cars/${id}`, {
    headers: this.getAuthHeaders()
  });
}


  updateCar(carId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(
      `http://localhost:5000/api/agent/cars/${carId}`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  addCar(formData: FormData): Observable<any> {
    return this.http.post<any>(
      'http://localhost:5000/api/agent/cars',
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteCar(id: string): Observable<any> {
    return this.http.delete<any>(
      `http://localhost:5000/api/agent/cars/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }



  getAvailableCars(): Observable<Cars[]> {
  return this.getAllCars().pipe(
    map(cars => cars.filter(car => car.availabilityStatus === 'Available'))
  );
}

getRentedCars(): Observable<Cars[]> {
  return this.getAllCars().pipe(
    map(cars => cars.filter(car => car.availabilityStatus === 'Rented'))
  );
}

getUnderMaintenanceCars(): Observable<Cars[]> {
  return this.getAllCars().pipe(
    map(cars => cars.filter(car => car.availabilityStatus === 'Under Maintenance'))
  );
}

}
