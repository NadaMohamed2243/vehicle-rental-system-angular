import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BookingRequest {
  carId: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  pickupLocation: string;
  dropoffLocation: string;
}

export interface Booking {
  clientId: string;
  carId: string;
  agent: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  billingName: string;
  billingPhone: string;
  clientEmail: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  with_Driver: boolean;
  __v: number;
}

export interface BookingResponse {
  booking: Booking;
  iframeUrl: string;
}

export interface ResumePaymentResponse {
  iframeUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bookings`;

  bookAndPay(bookingData: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(
      `${this.apiUrl}/book-and-pay`,
      bookingData
    );
  }

  getCarBookingHistory(carId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      `${environment.apiUrl}/client/cars/bookings/${carId}`
    );
  }

  refundBooking(bookingId: string): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/payments/refund/${bookingId}`,
      {}
    );
  }

  resumePayment(bookingId: string): Observable<ResumePaymentResponse> {
    return this.http.get<ResumePaymentResponse>(
      `${environment.apiUrl}/payments/resume/${bookingId}`
    );
  }
  completeBooking(id: string) {
    return this.http.put(`${environment.apiUrl}/bookings/${id}/complete`, {});
  }

  markAsReturned(id: string) {
    return this.http.put(`${environment.apiUrl}/bookings/${id}/return-car`, {});
  }
  returnAndComplete(bookingId: string) {
  return this.http.patch(`${environment.apiUrl}/bookings/${bookingId}/return-complete`, {});
}
markAsRented(bookingId: string) {
  return this.http.patch(`${environment.apiUrl}/bookings/${bookingId}/mark-rented`, {});
}
}
