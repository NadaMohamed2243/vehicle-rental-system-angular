import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cars } from '../interfaces/cars';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:5000/api/client/cars/wishlist';

  getWishlist(): Observable<Cars[]> {
    return this.http.get<Cars[]>(this.apiUrl);
  }
}
