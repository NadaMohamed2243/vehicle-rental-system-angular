import { Component, OnInit } from '@angular/core';
import { AdmincarsService } from '../../../../core/services/admincars.service';
import { ClientService } from '../../../../core/services/client.service';
import { AgentService } from '../../../../core/services/agent.service';

@Component({
  selector: 'app-overview',
  imports: [],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  totalCars: number = 0;
  availableCars: number = 0;
  rentedCars: number = 0;
  maintenanceCars: number = 0;
  pendingCars: number = 0;
  rejectedCars:number = 0;
  totalRevenue: number = 0;
  totalProfit: number = 0;
  clientsTotal = 0;
  clientsApproved = 0;
  agentsTotal = 0;

  constructor(private agentService:AgentService,private adminCarsService: AdmincarsService,private clientService:ClientService) {}

  ngOnInit(): void {
    this.loadAdminCarStats();
    this.loadRentalStats();
    this.loadclients();
    this.loadAgents();
  }
  loadAgents():void{
    this.agentService.getAllAgents().subscribe(allAgents => {
  this.agentsTotal = allAgents.length;
});
  }
  loadclients():void{
    this.clientService.getAllClients().subscribe(clients => {
    this.clientsTotal = clients.length;
    this.clientsApproved = clients.filter(client => client.verification_status === 'approved').length;
});
  }
  loadRentalStats(): void {
  this.adminCarsService.getAllBookings().subscribe(bookings => {
    const paidBookings = bookings.filter(b => b.status === 'paid');
    this.totalRevenue = Math.round(
      paidBookings.reduce((sum, booking) => sum + booking.totalCost, 0)
    );
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

}
