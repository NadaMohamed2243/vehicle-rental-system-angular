import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cars } from '../interfaces/cars';

export interface Booking {
  clientId: string;
  carId: Cars;
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

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private http: HttpClient) {}

  getHistory() {
    return this.http.get<Booking[]>(
      'http://localhost:5000/api/client/cars/history'
    );
  }
}
