import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdmincarsService } from '../../../../core/services/admincars.service';
import { Cars } from '../../../../core/interfaces/cars';
import { UserHeaderComponent } from '../../user-header/user-header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agent-car-cards',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    TableModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    UserHeaderComponent
  ],
  templateUrl: './agent-car-cards.component.html',
  styleUrls: ['./agent-car-cards.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AgentCarCardsComponent implements OnInit {
  searchTerm: string = '';
  selectedCar: Cars | null = null;
  displayCarDialog: boolean = false;
  activeTabIndex: number = 0;

  cars: Cars[] = [];
  availableCars: Cars[] = [];
  rentedCars: Cars[] = [];
  // underMaintenanceCars: Cars[] = [];
  approvedCars: Cars[] = [];
  rejectedCars: Cars[] = [];
  pendingCars: Cars[] = [];

  statusTabs = [
    { label: 'All Cars', key: 'all' },
    { label: 'Available', key: 'available' },
    { label: 'Rented', key: 'rented' },
    // { label: 'Under Maintenance', key: 'maintenance' },
    { label: 'Pending', key: 'pending' },
    { label: 'Approved', key: 'approved' },
    { label: 'Rejected', key: 'rejected' }
  ];
  selectedTabKey: string = 'all';

  constructor(
    private _AdmincarService: AdmincarsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
     private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars() {
    this._AdmincarService.getAllCars().subscribe(res => this.cars = res);
    this._AdmincarService.getAvailableCars().subscribe(res => this.availableCars = res);
    this._AdmincarService.getRentedCars().subscribe(res => this.rentedCars = res);
    // this._AdmincarService.getUnderMaintenanceCars().subscribe(res => this.underMaintenanceCars = res);
    this._AdmincarService.getAllCars().subscribe(res => {
      this.approvedCars = res.filter(c => c.approval_status === 'approved');
      this.rejectedCars = res.filter(c => c.approval_status === 'rejected');
      this.pendingCars = res.filter(c => c.approval_status === 'pending');
    });
  }

  onTabChange(event: any) {
    this.selectedTabKey = this.statusTabs[event.index].key;
  }

  getFilteredCars(): Cars[] {
    const term = this.searchTerm.toLowerCase();
    let list: Cars[] = [];

    switch (this.selectedTabKey) {
      case 'all': list = this.cars; break;
      case 'available': list = this.availableCars; break;
      case 'rented': list = this.rentedCars; break;
      // case 'maintenance': list = this.underMaintenanceCars; break;
      case 'pending': list = this.pendingCars; break;
      case 'approved': list = this.approvedCars; break;
      case 'rejected': list = this.rejectedCars; break;
    }

    return list.filter(car =>
      (car.brand + car.model + car.licensePlate + car.type + car.availabilityStatus + car.approval_status)
        .toLowerCase().includes(term)
    );
  }

  selectCar(car: Cars) {
    this.selectedCar = car;
    this.displayCarDialog = true;
  }
  markAsAvailable(carId: string) {
  this._AdmincarService.updateAvailability(carId, 'Available').subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Car marked as Available' });
      this.loadCars();
      this.displayCarDialog = false;
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Failed to update status' });
    }
  });
}

markAsRented(carId: string) {
  this._AdmincarService.updateAvailability(carId, 'Rented').subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Car marked as Rented' });
      this.loadCars();
      this.displayCarDialog = false;
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Failed to update status' });
    }
  });
}




    editCar(car: Cars) {
    this.router.navigate(['/agent-dashboard/agent-add-car', car._id]);
  }

  confirmDeleteCar(carId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this car?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._AdmincarService.deleteCar(carId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Car deleted successfully' });
            this.loadCars();
            this.displayCarDialog = false;
            this.selectedCar = null;
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete car' });
          }
        });
      }
    });
  }
}

