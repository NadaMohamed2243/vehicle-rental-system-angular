import { Cars } from "./cars";

export interface Orders {
  _id: string;
  clientId: string;
  carId: Cars ;
  startDate: string;
  endDate: string;
  totalCost: number;
  billingName: string;
  billingPhone: string;
  clientEmail: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
