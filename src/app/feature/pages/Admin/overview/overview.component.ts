import { Component, OnInit } from '@angular/core';
import { AdmincarsService } from '../../../../core/services/admincars.service';
import { ClientService } from '../../../../core/services/client.service';
import { AgentService } from '../../../../core/services/agent.service';
import { UserHeaderComponent } from '../../user-header/user-header.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-overview',
  imports: [UserHeaderComponent, CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  totalCars: number = 0;
  availableCars: number = 0;
  rentedCars: number = 0;
  maintenanceCars: number = 0;
  pendingCars: number = 0;
  rejectedCars: number = 0;
  totalRevenue: number = 0;
  totalProfit: number = 0;
  clientsTotal = 0;
  clientsApproved = 0;
  agentsTotal = 0;

  cars: any[] = [];
  bookings: any[] = [];
  topRentedCars: any[] = [];
  latestCar: any = null;


  constructor(
    private agentService: AgentService,
    private adminCarsService: AdmincarsService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadAdminCarStats();
    this.loadRentalStats();
    this.loadclients();
    this.loadAgents();
    this.loadAllCars();     
    this.loadAllBookings();
  }

  loadAgents(): void {
    this.agentService.getAllAgents().subscribe(allAgents => {
      this.agentsTotal = allAgents.length;
    });
  }

  loadclients(): void {
    this.clientService.getAllClients().subscribe(clients => {
      this.clientsTotal = clients.length;
      this.clientsApproved = clients.filter(client => client.verification_status === 'approved').length;
    });
  }

  loadRentalStats(): void {
    this.adminCarsService.getAllBookings().subscribe(bookings => {
      const paidBookings = bookings.filter(b => b.status === 'paid');
      this.totalRevenue = Math.round(paidBookings.reduce((sum, booking) => sum + booking.totalCost, 0));
      this.totalProfit = Math.round(this.totalRevenue * 0.1);
    });
  }

  loadAdminCarStats(): void {
    this.adminCarsService.getTotalApprovedCarCount().subscribe(count => this.totalCars = count);
    this.adminCarsService.getAvailableCarCountAdmin().subscribe(count => this.availableCars = count);
    this.adminCarsService.getRentedCarCountAdmin().subscribe(count => this.rentedCars = count);
    this.adminCarsService.getUnderMaintenanceCarCountAdmin().subscribe(count => this.maintenanceCars = count);
    this.adminCarsService.getPendingCarCountAdmin().subscribe(count => this.pendingCars = count);
    this.adminCarsService.getRejectedCarCountAdmin().subscribe(count => this.rejectedCars = count);
  }

 loadAllCars(): void {
  // console.log('loadAllCars() called');
  this.adminCarsService. getALLCarsAdmin().subscribe(cars => {
    // console.log('Cars response:', cars);
    this.cars = cars;
    this.latestCar = cars.length ? cars[cars.length - 1] : null;

    // console.log('Latest Car:', this.latestCar);

    if (this.bookings.length) {
      this.calculateTopRentedCars();
      // console.log('Top Rented Cars after loading cars:', this.topRentedCars);
    }
  });
}

loadAllBookings(): void {
  this.adminCarsService.getAllBookings().subscribe(bookings => {
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
