import { Injectable } from '@angular/core';
import { Cars } from '../../core/interfaces/cars';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { header } from './../../../../.angular/cache/19.2.10/VehicleRentalSystem/vite/deps_ssr/primeng_table';
//import { apiUrl } from '../../../environments/environment';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdmincarsService {
  private _cars!: Cars[];

  constructor(private http: HttpClient) {}

  // Generate headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  //for agent
  getAllCars(): Observable<Cars[]> {
    return this.http
      .get<Cars[]>(`${environment.apiUrl}/agent/cars`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((cars) => {
          this._cars = cars;
          return cars;
        })
      );
  }

  getCar(id: string): Observable<Cars> {
    return this.http.get<Cars>(`${environment.apiUrl}/agent/cars/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateCar(carId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(
      `${environment.apiUrl}/agent/cars/${carId}`,
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  addCar(formData: FormData): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/agent/cars`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteCar(id: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/agent/cars/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getAgentBookings(): Observable<any[]> {
  return this.http.get<any[]>(
    `${environment.apiUrl}/agent/cars/bookings`,
    { headers: this.getAuthHeaders() }
  );
}
  getAvailableCars(): Observable<Cars[]> {
    return this.getAllCars().pipe(
      map((cars) =>
        cars.filter((car) => car.availabilityStatus === 'Available')
      )
    );
  }

  getRentedCars(): Observable<Cars[]> {
    return this.getAllCars().pipe(
      map((cars) => cars.filter((car) => car.availabilityStatus === 'Rented'))
    );
  }

  getUnderMaintenanceCars(): Observable<Cars[]> {
    return this.getAllCars().pipe(
      map(cars => cars.filter(car => car.availabilityStatus === 'Under Maintenance'))
    );
  }

  // ------------------ AGENT Counts ------------------

  getAgentCarCount(): Observable<number> {
  return this.getAllCars().pipe(
    map(cars => cars.length)
  );
}

getAvailableCarCount(): Observable<number> {
  return this.getAvailableCars().pipe(
    map(cars => cars.length)
  );
}

getRentedCarCount(): Observable<number> {
  return this.getRentedCars().pipe(
    map(cars => cars.length)
  );
}

getUnderMaintenanceCarCount(): Observable<number> {
  return this.getUnderMaintenanceCars().pipe(
    map(cars => cars.length)
  );
}

  // -----admin dashboard car list see all cars & Approve Car-----

getALLCarsAdmin(): Observable<Cars[]> {
  return this.http.get<Cars[]>('http://localhost:5000/api/cars', {
    headers: this.getAuthHeaders()
  }).pipe(
    map(cars => {
      this._cars = cars;
      return cars;
    })
  );
}


  // getALLCarsAdmin(): Observable<Cars[]> {
  //   return this.http.get<Cars[]>('${environment.apiUrl}/cars', {
  //     headers: this.getAuthHeaders()
  //   }).pipe(
  //     map(cars => {
  //       this._cars = cars;
  //       return cars;
  //     })
  //   );
  // }

  getPendingCarsAdmin(): Observable<Cars[]> {
    return this.http.get<Cars[]>(`${environment.apiUrl}/admin/cars/pending`, {
      headers: this.getAuthHeaders(),
    });
  }

  getapprovedCarsAdmin(): Observable<Cars[]> {
    return this.http.get<Cars[]>(`${environment.apiUrl}/admin/cars/approved`, {
      headers: this.getAuthHeaders(),
    });
  }

  getRejectedCarsAdmin(): Observable<Cars[]> {
    return this.http.get<Cars[]>(`${environment.apiUrl}/admin/cars/rejected`, {
      headers: this.getAuthHeaders(),
    });
  }

  approveCarAdmin(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/cars/${id}/approve`, {
      headers: this.getAuthHeaders(),
    });
  }

  rejectCarAdmin(id: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/cars/${id}/reject`, {
      headers: this.getAuthHeaders(),
    });
  }

   getAvailableCarsAdmin(): Observable<Cars[]> {
  return this.getapprovedCarsAdmin().pipe(
    map(cars => cars.filter(car => car.availabilityStatus === 'Available'))
  );
}

  getRentedCarsAdmin(): Observable<Cars[]> {
    return this.getapprovedCarsAdmin().pipe(
      map((cars) => cars.filter((car) => car.availabilityStatus === 'Rented'))
    );
  }

  getUnderMaintenanceCarsAdmin(): Observable<Cars[]> {
    return this.getapprovedCarsAdmin().pipe(
      map((cars) =>
        cars.filter((car) => car.availabilityStatus === 'Under Maintenance')
      )
    );
  }

  deleteCarAdmin(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/cars/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
   getAllBookings(): Observable<any[]> {
  return this.http.get<any[]>(
    `${environment.apiUrl}/bookings`,
    { headers: this.getAuthHeaders() }
  );
}
 // ------------------ ADMIN Counts ------------------

  getTotalApprovedCarCount(): Observable<number> {
    return this.getapprovedCarsAdmin().pipe(
      map(cars => cars.length)
    );
  }

  getAvailableCarCountAdmin(): Observable<number> {
    return this.getAvailableCarsAdmin().pipe(
      map(cars => cars.length)
    );
  }

  getRentedCarCountAdmin(): Observable<number> {
    return this.getRentedCarsAdmin().pipe(
      map(cars => cars.length)
    );
  }

  getUnderMaintenanceCarCountAdmin(): Observable<number> {
    return this.getUnderMaintenanceCarsAdmin().pipe(
      map(cars => cars.length)
    );
  }

  getPendingCarCountAdmin(): Observable<number> {
    return this.getPendingCarsAdmin().pipe(
      map(cars => cars.length)
    );
  }

  getRejectedCarCountAdmin(): Observable<number> {
    return this.getRejectedCarsAdmin().pipe(
      map(cars => cars.length)
    );
  }

  updateAvailability(carId: string, status: 'Available' | 'Rented') {
  return this.http.patch(`${environment.apiUrl}/cars/${carId}/availability`, { status });
}


}
