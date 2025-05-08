import { inject, Injectable } from '@angular/core';
import { Car } from '../../core/interfaces/car';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  private _cars: Car[] = [
    {
      car_id: '12345',
      brand: 'Hyundai',
      model: 'Corolla',
      year: 2021,
      license_plate: 'XYZ 1234',
      vin: '1HGBH41JXMN109186',
      type: 'pickup',
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      seats: 5,
      color: 'gray',
      mileage: 50000,
      rental_rate_per_day: 40,
      rental_rate_per_hour: 10,
      rating: 4.5,
      availability_status: 'Available',
      current_location: 'Main Branch',
      location: {
        city: 'Cairo',
      },
      deposit_required: 100,
      insurance_status: 'Full Coverage',
      last_maintenance_date: '2024-01-15',
      next_maintenance_due: '2025-01-15',
      condition_notes: 'Minor scratches on the rear bumper',
      fuel_level: 'Full',
      odometer_reading: 50000,
      date_added_to_fleet: '2021-06-01',
      last_rented_date: '2025-04-20',
      expected_return_date: '2025-04-25',
      total_price_per_hour: 200,
      rental_history: [
        {
          rental_id: 'R1001',
          customer_id: 'C2001',
          start_date: '2025-04-10',
          end_date: '2025-04-15',
          total_amount: 200,
        },
        {
          rental_id: 'R1002',
          customer_id: 'C2002',
          start_date: '2025-03-15',
          end_date: '2025-03-20',
          total_amount: 180,
        },
      ],
      car_photos: ['/images/car1.webp'],
    },
    {
      car_id: '67890',
      brand: 'nissan',
      model: 'Civic',
      year: 2022,
      license_plate: 'ABC 5678',
      vin: '2HGES16555H109187',
      type: 'sports',
      transmission: 'Manual',
      fuel_type: 'Diesel',
      seats: 5,
      color: 'blue',
      mileage: 35000,
      rental_rate_per_day: 50,
      rental_rate_per_hour: 12,
      rating: 2.7,
      availability_status: 'Rented',
      current_location: 'Downtown Branch',
      location: {
        city: 'Cairo',
      },
      deposit_required: 120,
      insurance_status: 'Partial Coverage',
      last_maintenance_date: '2024-03-10',
      next_maintenance_due: '2025-03-10',
      condition_notes: 'Good condition',
      fuel_level: 'Half',
      odometer_reading: 35000,
      date_added_to_fleet: '2022-03-15',
      last_rented_date: '2025-04-22',
      expected_return_date: '2025-04-27',
      total_price_per_hour: 220,
      rental_history: [
        {
          rental_id: 'R1003',
          customer_id: 'C2003',
          start_date: '2025-04-01',
          end_date: '2025-04-05',
          total_amount: 240,
        },
      ],
      car_photos: ['/images/car2.png'],
    },
    {
      car_id: '11223',
      brand: 'Ford',
      model: 'Escape',
      year: 2020,
      license_plate: 'DEF 9101',
      vin: '3FADP4EJ0EM200123',
      type: 'van',
      transmission: 'Automatic',
      fuel_type: 'Hybrid',
      seats: 5,
      color: 'white',
      mileage: 60000,
      rental_rate_per_day: 60,
      rental_rate_per_hour: 15,
      rating: 4.2,
      availability_status: 'Under Maintenance',
      current_location: 'Airport Branch',
      location: {
        city: 'Mansoura',
      },
      deposit_required: 150,
      insurance_status: 'Full Coverage',
      last_maintenance_date: '2024-02-20',
      next_maintenance_due: '2025-02-20',
      condition_notes: 'Brake pads replaced recently',
      fuel_level: 'Quarter',
      odometer_reading: 60000,
      date_added_to_fleet: '2020-08-10',
      last_rented_date: '2025-03-15',
      expected_return_date: '2025-03-20',
      total_price_per_hour: 250,
      rental_history: [
        {
          rental_id: 'R1004',
          customer_id: 'C2004',
          start_date: '2025-03-01',
          end_date: '2025-03-07',
          total_amount: 310,
        },
      ],
      car_photos: ['/images/car3.png'],
    },
    {
      car_id: '33445',
      brand: 'BMW',
      model: 'X5',
      year: 2023,
      license_plate: 'GHI 2345',
      vin: 'WBAEN33494PC12345',
      type: 'Limousine',
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      seats: 7,
      color: 'black',
      mileage: 15000,
      rental_rate_per_day: 100,
      rental_rate_per_hour: 25,
      rating: 4.9,
      availability_status: 'Available',
      current_location: 'Luxury Branch',
      location: {
        city: 'Mansoura',
      },
      deposit_required: 300,
      insurance_status: 'Full Coverage',
      last_maintenance_date: '2025-01-01',
      next_maintenance_due: '2026-01-01',
      condition_notes: 'Like new',
      fuel_level: 'Full',
      odometer_reading: 15000,
      date_added_to_fleet: '2023-07-20',
      last_rented_date: '2025-04-10',
      expected_return_date: '2025-04-15',
      total_price_per_hour: 350,
      rental_history: [
        {
          rental_id: 'R1005',
          customer_id: 'C2005',
          start_date: '2025-03-10',
          end_date: '2025-03-14',
          total_amount: 500,
        },
      ],
      car_photos: ['/images/car4.png'],
    },
    {
      car_id: '123451',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2021,
      license_plate: 'XYZ 1234',
      vin: '1HGBH41JXMN109186',
      type: 'Sedan',
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      seats: 5,
      color: 'gray',
      mileage: 50000,
      rental_rate_per_day: 40,
      rental_rate_per_hour: 10,
      rating: 4.2,
      availability_status: 'Available',
      current_location: 'Main Branch',
      location: {
        city: 'Cairo',
      },
      deposit_required: 100,
      insurance_status: 'Full Coverage',
      last_maintenance_date: '2024-01-15',
      next_maintenance_due: '2025-01-15',
      condition_notes: 'Minor scratches on the rear bumper',
      fuel_level: 'Full',
      odometer_reading: 50000,
      date_added_to_fleet: '2021-06-01',
      last_rented_date: '2025-04-20',
      expected_return_date: '2025-04-25',
      total_price_per_hour: 200,
      rental_history: [
        {
          rental_id: 'R1001',
          customer_id: 'C2001',
          start_date: '2025-04-10',
          end_date: '2025-04-15',
          total_amount: 200,
        },
        {
          rental_id: 'R1002',
          customer_id: 'C2002',
          start_date: '2025-03-15',
          end_date: '2025-03-20',
          total_amount: 180,
        },
      ],
      car_photos: ['/images/car1.webp'],
    },
    {
      car_id: '678901',
      brand: 'Honda',
      model: 'Civic',
      year: 2022,
      license_plate: 'ABC 5678',
      vin: '2HGES16555H109187',
      type: 'Sedan',
      transmission: 'Manual',
      fuel_type: 'Diesel',
      seats: 5,
      color: 'blue',
      mileage: 35000,
      rental_rate_per_day: 50,
      rental_rate_per_hour: 12,
      rating: 2,
      availability_status: 'Rented',
      current_location: 'Downtown Branch',
      location: {
        city: 'Mansoura',
      },
      deposit_required: 120,
      insurance_status: 'Partial Coverage',
      last_maintenance_date: '2024-03-10',
      next_maintenance_due: '2025-03-10',
      condition_notes: 'Good condition',
      fuel_level: 'Half',
      odometer_reading: 35000,
      date_added_to_fleet: '2022-03-15',
      last_rented_date: '2025-04-22',
      expected_return_date: '2025-04-27',
      total_price_per_hour: 220,
      rental_history: [
        {
          rental_id: 'R1003',
          customer_id: 'C2003',
          start_date: '2025-04-01',
          end_date: '2025-04-05',
          total_amount: 240,
        },
      ],
      car_photos: ['/images/car2.png'],
    },
    {
      car_id: '112231',
      brand: 'Ford',
      model: 'Escape',
      year: 2020,
      license_plate: 'DEF 9101',
      vin: '3FADP4EJ0EM200123',
      type: 'SUV',
      transmission: 'Automatic',
      fuel_type: 'Hybrid',
      seats: 5,
      color: 'white',
      mileage: 60000,
      rental_rate_per_day: 60,
      rental_rate_per_hour: 15,
      rating: 3.7,
      availability_status: 'Under Maintenance',
      current_location: 'Airport Branch',
      location: {
        city: 'Mansoura',
      },
      deposit_required: 150,
      insurance_status: 'Full Coverage',
      last_maintenance_date: '2024-02-20',
      next_maintenance_due: '2025-02-20',
      condition_notes: 'Brake pads replaced recently',
      fuel_level: 'Quarter',
      odometer_reading: 60000,
      date_added_to_fleet: '2020-08-10',
      last_rented_date: '2025-03-15',
      expected_return_date: '2025-03-20',
      total_price_per_hour: 250,
      rental_history: [
        {
          rental_id: 'R1004',
          customer_id: 'C2004',
          start_date: '2025-03-01',
          end_date: '2025-03-07',
          total_amount: 310,
        },
      ],
      car_photos: ['/images/car3.png'],
    },
    {
      car_id: '334451',
      brand: 'BMW',
      model: 'X5',
      year: 2023,
      license_plate: 'GHI 2345',
      vin: 'WBAEN33494PC12345',
      type: 'SUV',
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      seats: 7,
      color: 'black',
      mileage: 15000,
      rental_rate_per_day: 100,
      rental_rate_per_hour: 25,
      rating: 5,
      availability_status: 'Available',
      current_location: 'Luxury Branch',
      location: {
        city: 'Mansoura',
      },
      deposit_required: 300,
      insurance_status: 'Full Coverage',
      last_maintenance_date: '2025-01-01',
      next_maintenance_due: '2026-01-01',
      condition_notes: 'Like new',
      fuel_level: 'Full',
      odometer_reading: 15000,
      date_added_to_fleet: '2023-07-20',
      last_rented_date: '2025-04-10',
      expected_return_date: '2025-04-15',
      total_price_per_hour: 350,
      rental_history: [
        {
          rental_id: 'R1005',
          customer_id: 'C2005',
          start_date: '2025-03-10',
          end_date: '2025-03-14',
          total_amount: 500,
        },
      ],
      car_photos: ['/images/car4.png'],
    },
  ];

  private _popularCars!: Car[];
  private _nearbyCars!: Car[];
  _userService = inject(UserService);
  userCity: string = '';

  setCars(cars: Car[]) {
    this._cars = cars;
  }

  // if the filtration attribute == all call this
  getCars(): Car[] {
    return this._cars;
  }

  // if the filtration attribute == most-popular call this
  // Get popular cars (sorted by rating)
  getMostPopularCars() {
    this._popularCars = [...this._cars]
      .filter((car) => (car.rating || 0) > 3.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return this._popularCars;
  }

  // if the filtration attribute == NearBy call this
  getNearByCars() {
    this.userCity = this._userService.getUser().location.city;
    this._nearbyCars = this._cars.filter(
      (car) => car.location.city.toLowerCase() === this.userCity.toLowerCase()
    );
    return this._nearbyCars;
  }

  // --------------------car types---------------------

  getPopularTypes(): { type: string; count: number }[] {
    const typeCounts: { [key: string]: number } = {};

    this._cars.forEach((car) => {
      if (typeCounts[car.type]) {
        typeCounts[car.type]++;
      } else {
        typeCounts[car.type] = 1;
      }
    });

    return Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }

  // if the type == {type} call this
  getCarsByType(type: string): Car[] {
    return this._cars.filter((car) => car.type === type);
  }

  // -----------------------car brands-------------------
  // Add these methods to your CarsService
  getPopularBrands(): { brand: string; count: number }[] {
    const brandCounts: { [key: string]: number } = {};

    this._cars.forEach((car) => {
      if (brandCounts[car.brand]) {
        brandCounts[car.brand]++;
      } else {
        brandCounts[car.brand] = 1;
      }
    });

    return Object.entries(brandCounts)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count);
  }

  getCarsByBrand(brand: string): Car[] {
    return this._cars.filter((car) => car.brand === brand);
  }

  constructor() {}
}
