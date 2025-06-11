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
import { provideAnimations } from '@angular/platform-browser/animations';




@Component({
  selector: 'app-agent-car-cards',
  standalone: true,
  imports: [CommonModule, FormsModule, TabViewModule, CardModule ,ConfirmDialogModule,MessagesModule,ToastModule],
  templateUrl: './agent-car-cards.component.html',
  styleUrl: './agent-car-cards.component.css',
  providers: [ConfirmationService, MessageService,provideAnimations()]
})
export class AgentCarCardsComponent implements OnInit {
  constructor(private _AdmincarService: AdmincarsService,private router: Router, private confirmationService: ConfirmationService, private messageService: MessageService) {}
  cars: Cars[] = [];
  availableCars: Cars[] = [];
  occupiedCars: Cars[] = [];
  selectedCar: Cars | null = null;

  
  ngOnInit(): void {
    this.loadCars();
  }
//load cars from the service
  loadCars() {
     this._AdmincarService.getAllCars().subscribe((res: Cars[]) => {
    this.cars = res;
  });

  this._AdmincarService.getAvailableCars().subscribe((res: Cars[]) => {
    this.availableCars = res;
  });

  this._AdmincarService.getOccupiedCars().subscribe((res: Cars[]) => {
    this.occupiedCars = res;
  });
  }

  // to open car card details
  selectCar(car: Cars) {
    this.selectedCar = car;
  }

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