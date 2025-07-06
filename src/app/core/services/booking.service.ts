import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/bookings';

  bookAndPay(bookingData: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(
      `${this.apiUrl}/book-and-pay`,
      bookingData
    );
  }

  getCarBookingHistory(carId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      `http://localhost:5000/api/client/cars/bookings/${carId}`
    );
  }
}
