import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
// import { ToastModule } from 'primeng/toast';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-car-card',
  standalone: true,
  imports: [CommonModule, FormsModule, TabViewModule, CardModule],
  templateUrl: './car-cards.component.html',
  styleUrl: './car-cards.component.css',
})
export class CarCardsComponent {
  constructor(private router: Router) {}
  // constructor(private messageService: MessageService, private confirmationService: ConfirmationService) { }
  carsFromApi = [
    {
      car_id: "12345",
      brand: "Toyota",
      model: "Corolla",
      year: 2021,
      license_plate: "XYZ 1234",
      type: "Sedan",
      transmission: "Automatic",
      fuel_type: "Petrol",
      seats: 5,
      color: "gray",
      mileage: 50000,
      rental_rate_per_day: 40,
      rental_rate_per_hour: 10,
      rating: 4.5,
      availability_status: "Available",
      current_location: "Main Branch",
      deposit_required: 100,
      insurance_status: "Full Coverage",
      last_maintenance_date: "2024-01-15",
      next_maintenance_due: "2025-01-15",
      condition_notes: "Minor scratches on the rear bumper",
      fuel_level: "Full",
      odometer_reading: 50000,
      date_added_to_fleet: "2021-06-01",
      last_rented_date: "2025-04-20",
      expected_return_date: "2025-04-25",
      rental_history: [],
      car_photos: ["https://th.bing.com/th/id/OIP.sAELQnYrxpt3JD5Z4MWR0wHaFP?cb=iwp1&rs=1&pid=ImgDetMain"]
    },
    {
      car_id: "12346",
      brand: "Honda",
      model: "Civic",
      year: 2020,
      license_plate: "ABC 5678",
      vin: "2HGBH41JXMN109187",
      type: "Sedan",
      transmission: "Manual",
      fuel_type: "Diesel",
      seats: 4,
      color: "blue",
      mileage: 60000,
      rental_rate_per_day: 35,
      rental_rate_per_hour: 9,
      rating: 4.2,
      availability_status: "Not Available",
      current_location: "Branch B",
      deposit_required: 90,
      insurance_status: "Partial Coverage",
      last_maintenance_date: "2024-02-20",
      next_maintenance_due: "2025-02-20",
      condition_notes: "Clean and well-maintained",
      fuel_level: "Half",
      odometer_reading: 60000,
      date_added_to_fleet: "2020-05-10",
      last_rented_date: "2025-04-22",
      expected_return_date: "2025-05-02",
      rental_history: [],
      car_photos: ["https://th.bing.com/th/id/OIP._8-ee9A7VjbIffmZUw6wKgHaEn?cb=iwp1&rs=1&pid=ImgDetMain"]
    }
  ];

  get allcars() {
    return this.carsFromApi.filter(
      car => car.availability_status === 'Available' || car.availability_status === 'Not Available'
    );
  }

  get availableCars() {
    return this.carsFromApi.filter(car => car.availability_status === 'Available');
  }

  get occupiedCars() {
    return this.carsFromApi.filter(car => car.availability_status !== 'Available');
  }

// to open car card details
  selectedCar: any = null;

  selectCar(car: any) {
    this.selectedCar = car;
  }



  // deleteCar(car: any) {
  //   this.allCars = this.allCars.filter(c => c.car_id !== car.car_id);
  //   this.selectedCar = null;
  // }
  

  // confirmDelete(car: any) {
  //   this.confirmationService.confirm({
  //     message: `Are you sure you want to delete ${car.license_plate}?`,
  //     header: 'Confirm Delete',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.deleteCar(car);
  
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Deleted',
  //         detail: `${car.license_plate} has been deleted`,
  //       });
  //     },
  //   });
  // }

editCar(car: any) {
  this.router.navigateByUrl('dashboard/add-car', {
    state: { car }
  });
}


}