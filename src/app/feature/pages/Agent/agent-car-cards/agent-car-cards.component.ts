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
  selector: 'app-agent-car-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, TabViewModule, CardModule ,ConfirmDialogModule,MessagesModule,ToastModule],
  templateUrl: './agent-car-cards.component.html',
  styleUrl: './agent-car-cards.component.css',
  providers: [ConfirmationService, MessageService]
})
export class AgentCarCardsComponent implements OnInit {
  constructor(private _AdmincarService: AdmincarsService,private router: Router, private confirmationService: ConfirmationService, private messageService: MessageService) {}
  cars: Cars[] = [];
  availableCars: Cars[] = [];
  rentedCars: Cars[] = [];
  underMaintenanceCars: Cars[] = [];
  selectedCar: Cars | null = null;
  approvedCars: Cars[] = [];
  rejectedCars: Cars[] = [];
  pendingCars: Cars[] = [];

  
  ngOnInit(): void {
    this.loadCars();
  }
//load cars from the service
  loadCars() {
      this._AdmincarService.getAllCars().subscribe((res: Cars[]) => {
      this.cars = res;
      this.approvedCars = res.filter(car => car.approval_status === 'approved');
      this.rejectedCars = res.filter(car => car.approval_status === 'rejected');
      this.pendingCars = res.filter(car => car.approval_status === 'pending');

  });

  this._AdmincarService.getAvailableCars().subscribe((res: Cars[]) => {
    this.availableCars = res;
  });

  this._AdmincarService.getRentedCars().subscribe((res: Cars[]) => {
    this.rentedCars = res;
  });
  this._AdmincarService.getUnderMaintenanceCars().subscribe(cars => {
  this.underMaintenanceCars = cars;
});

  }

  // to open car card details
  selectCar(car: Cars) {
    this.selectedCar = car;
  }

  //to navigate to add car page to edit
  editCar(car: any) {
    this.router.navigate(['/agent-dashboard/agent-add-car', car._id]);
  }


  // delete
  confirmDeleteCar(carId: string) {
    console.log('Delete Car ID:', carId); 
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this car?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._AdmincarService.deleteCar(carId).subscribe({
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


}