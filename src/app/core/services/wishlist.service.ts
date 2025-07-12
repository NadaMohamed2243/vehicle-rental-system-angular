import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cars } from '../interfaces/cars';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl}/client/cars/wishlist`;

  getWishlist(): Observable<Cars[]> {
    return this.http.get<Cars[]>(this.apiUrl);
  }

  addToWishlist(carId: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${carId}`, {});
  }

  removeFromWishlist(carId: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${carId}`);
  }
}
