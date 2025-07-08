import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentResultService {

  constructor(private http: HttpClient) {}
  private baseUrl = 'http://localhost:5000/api/payments';
  // Get payment status by booking ID
  getPaymentStatus(bookingId: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${this.baseUrl}/${bookingId}/status`);
  }
   resumePayment(bookingId: string) {
    return this.http.get<{ redirectUrl: string }>(`${this.baseUrl}/resume/${bookingId}`);
  }
}
