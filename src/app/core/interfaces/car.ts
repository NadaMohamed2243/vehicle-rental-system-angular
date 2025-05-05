export interface Car {
  car_id: string
  brand: string
  model: string
  year: number
  license_plate: string
  vin: string
  type: string
  transmission: string
  fuel_type: string
  seats: number
  color: string
  mileage: number
  rental_rate_per_day: number
  rental_rate_per_hour: number
  rating: number,
  availability_status: string   //'Available' | 'Rented' | 'Under Maintenance';
  current_location: string
  deposit_required: number
  insurance_status: string
  last_maintenance_date: string
  next_maintenance_due: string
  condition_notes: string
  fuel_level: string
  odometer_reading: number
  date_added_to_fleet: string
  last_rented_date: string
  expected_return_date: string
  total_price_per_hour:number,
  rental_history: RentalHistory[]
  car_photos: string[]
}

// Rental history interface for the car
export interface RentalHistory {
  rental_id: string;
  customer_id: string;
  start_date: string; // ISO format date of rental start
  end_date: string; // ISO format date of rental end
  total_amount: number; // Total rental amount charged
}
