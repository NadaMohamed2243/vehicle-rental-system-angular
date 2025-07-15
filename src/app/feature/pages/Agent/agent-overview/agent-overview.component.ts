import { AdmincarsService } from './../../../../core/services/admincars.service';
import { Component, inject } from '@angular/core';
import { Cars } from '../../../../core/interfaces/cars';
import { UserHeaderComponent } from '../../user-header/user-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-overview',
  imports: [ UserHeaderComponent,CommonModule],
  templateUrl: './agent-overview.component.html',
  styleUrl: './agent-overview.component.css'
})
export class AgentOverviewComponent {

   constructor(
      private adminCarsService: AdmincarsService,
    ) {}

totalCars: number = 0;
availableCars: number = 0;
rentedCars: number = 0;
maintenanceCars: number = 0;
cars: Cars[] = [];
pendingCars: Cars[] = [];
totalOrders: number = 0;
pendingOrders: number = 0;
completedOrders: number = 0;
pendingCarsCount: number = 0;
// adminCarsService=inject(AdmincarsService);



  bookings: any[] = [];
  topRentedCars: any[] = [];
  latestCar: any = null;

ngOnInit(): void {
  this.loadAgentCarStats();
  this.loadAgentBookingStats();
  this.loadCars();
  this.loadAllCars();
  this.loadAllBookings();
}
loadAgentBookingStats(): void {
  this.adminCarsService.getAgentBookings().subscribe(bookings => {
    console.log(bookings);
    this.totalOrders = bookings.length;
    this.pendingOrders = bookings.filter(b => b.status === 'pending').length;
    this.completedOrders = bookings.filter(b => b.status === 'paid').length;
  });
}
loadAgentCarStats(): void {
  this.adminCarsService.getAgentCarCount().subscribe(count => this.totalCars = count);
  this.adminCarsService.getAvailableCarCount().subscribe(count => this.availableCars = count);
  this.adminCarsService.getRentedCarCount().subscribe(count => this.rentedCars = count);
  this.adminCarsService.getUnderMaintenanceCarCount().subscribe(count => this.maintenanceCars = count);
}
 loadCars() {
  this.adminCarsService.getAllCars().subscribe((res: Cars[]) => {
    this.cars = res;
    this.pendingCars = res.filter(car => car.approval_status === 'pending');
    console.log(this.pendingCars);
    this.pendingCarsCount = this.pendingCars.length;
  });
}


 loadAllCars(): void {
  console.log('loadAllCars() called');
  this.adminCarsService.getAllCars().subscribe(cars => {
    console.log('Cars response:', cars);
    this.cars = cars;
    this.latestCar = cars.length ? cars[cars.length - 1] : null;

    console.log('Latest Car:', this.latestCar);

    if (this.bookings.length) {
      this.calculateTopRentedCars();
      console.log('Top Rented Cars after loading cars:', this.topRentedCars);
    }
  });
}

loadAllBookings(): void {
  this.adminCarsService.getAgentBookings().subscribe(bookings => {
    this.bookings = bookings.filter(b => b.status === 'paid');

    console.log('Bookings:', this.bookings);

    if (this.cars.length) {
      this.calculateTopRentedCars();
      console.log('Top Rented Cars (after loading bookings):', this.topRentedCars);
    }
  });
}


  calculateTopRentedCars(): void {
    const rentCount: { [carId: string]: { count: number; revenue: number; lastDate: string } } = {};

    this.bookings.forEach(booking => {
      const id = booking.carId._id || booking.carId;
      if (!rentCount[id]) {
        rentCount[id] = {
          count: 1,
          revenue: booking.totalCost,
          lastDate: booking.startDate
        };
      } else {
        rentCount[id].count++;
        rentCount[id].revenue += booking.totalCost;
        if (new Date(booking.startDate) > new Date(rentCount[id].lastDate)) {
          rentCount[id].lastDate = booking.startDate;
        }
      }
    });

    this.topRentedCars = Object.entries(rentCount)
      .map(([carId, data]) => {
        const car = this.cars.find(c => c._id === carId);
        return {
          ...data,
          car
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}


