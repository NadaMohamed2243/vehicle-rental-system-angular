import { AdmincarsService } from './../../../../core/services/admincars.service';
import { Component, inject } from '@angular/core';
import { Cars } from '../../../../core/interfaces/cars';
@Component({
  selector: 'app-agent-overview',
  imports: [],
  templateUrl: './agent-overview.component.html',
  styleUrl: './agent-overview.component.css'
})
export class AgentOverviewComponent {
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
adminCarsService=inject(AdmincarsService);
ngOnInit(): void {
  this.loadAgentCarStats();
  this.loadAgentBookingStats();
  this.loadCars();
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
    this.pendingCarsCount = this.pendingCars.length; // 👈 this gives you the count
  });
}
}
