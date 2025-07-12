import { Injectable } from '@angular/core';
import { Orders } from '../../core/interfaces/orders';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private _HttpClient: HttpClient) {}

  // Generate headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // for admin dashboard
  getAllOrdersAdmin(): Observable<Orders[]> {
    return this._HttpClient.get<Orders[]>(
      `${environment.apiUrl}/admin/cars/booking`,
      { headers: this.getAuthHeaders() }
    );
  }

  // for agent dashboard
  getAllOrdersAgent(): Observable<Orders[]> {
    return this._HttpClient.get<Orders[]>(
      `${environment.apiUrl}/agent/cars/bookings`,
      { headers: this.getAuthHeaders() }
    );
  }

  //cancelled orders by agent
  CancelOrdersAgent(orderId: string): Observable<any> {
    return this._HttpClient.put(
      `${environment.apiUrl}/bookings/${orderId}/cancel`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // cancelled order by admin
  cancelOrder(orderId: string): Observable<any> {
    return this._HttpClient.put(
      `${environment.apiUrl}/bookings/${orderId}/cancel`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  // delete order by admin
  deleteOrder(orderId: string): Observable<any> {
    return this._HttpClient.delete(
      `${environment.apiUrl}/bookings/${orderId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
