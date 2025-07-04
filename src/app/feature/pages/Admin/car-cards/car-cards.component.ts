import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { AdmincarsService } from '../../../../core/services/admincars.service';
import { Cars } from '../../../../core/interfaces/cars';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';




@Component({
  selector: 'app-car-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, TabViewModule, CardModule ,ConfirmDialogModule,MessagesModule,ToastModule],
  templateUrl: './car-cards.component.html',
  styleUrl: './car-cards.component.css',
  providers: [ConfirmationService, MessageService]
})
export class CarCardsComponent implements OnInit {
  constructor(private _AdmincarService: AdmincarsService,private router: Router, private confirmationService: ConfirmationService, private messageService: MessageService) {}
  cars: Cars[] = [];
  availableCars: Cars[] = [];
  rentedCars: Cars[] = [];
  underMaintenanceCars: Cars[] = [];
  selectedCar: Cars | null = null;
  pendingCars: Cars[] = [];
  approvedCars: Cars[] = [];
  rejectedCars: Cars[] = []; 

  
  ngOnInit(): void {
    this.loadCars();
  }
//load cars from the service
  loadCars() {
      // this._AdmincarService.getALLCarsAdmin().subscribe((res: Cars[]) => {
      // this.cars = res;
      // this.pendingCars = res.filter(car => car.approval_status === 'pending');

  // });

  this._AdmincarService.getAvailableCarsAdmin().subscribe((res: Cars[]) => {
    this.availableCars = res;
  });

  this._AdmincarService.getRentedCarsAdmin().subscribe((res: Cars[]) => {
    this.rentedCars = res;
  });
  this._AdmincarService.getUnderMaintenanceCarsAdmin().subscribe(cars => {
  this.underMaintenanceCars = cars;
  });

  this._AdmincarService.getPendingCarsAdmin().subscribe((res: Cars[]) => {
      this.pendingCars = res;
    });

  this._AdmincarService.getapprovedCarsAdmin().subscribe((res: Cars[]) => {
      this.approvedCars = res;
    });
  this._AdmincarService.getRejectedCarsAdmin().subscribe((res: Cars[]) => {
      this.rejectedCars = res;
    }); 

  }

  // to open car card details
  selectCar(car: Cars) {
    this.selectedCar = car;
  }


  // delete
  confirmDeleteCar(carId: string) {
    console.log('Delete Car ID:', carId); 
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this car?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._AdmincarService.deleteCarAdmin(carId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Car deleted successfully' });
            this.loadCars(); // Reload the cars after deletion
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete car' });
          }
        });
      }
    });
  }



  // Approve car
  approveCar(id: string) {
  this._AdmincarService.approveCarAdmin(id).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Approved', detail: 'Car approved successfully' });
      this.loadCars();
      this.selectedCar = null;
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to approve car' });
    }
  });
}

// Reject car
rejectCar(id: string) {
  this._AdmincarService.rejectCarAdmin(id).subscribe({
    next: () => {
      this.messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'Car rejected successfully' });
      this.loadCars();
      this.selectedCar = null;
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to reject car' });
    }
  });
}



}