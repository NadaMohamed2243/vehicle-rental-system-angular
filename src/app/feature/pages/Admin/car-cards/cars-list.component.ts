import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdmincarsService } from '../../../../core/services/admincars.service';
import { Cars } from '../../../../core/interfaces/cars';
import { UserHeaderComponent } from '../../user-header/user-header.component';

@Component({
  selector: 'app-cars-list',
  standalone: true,
  templateUrl: './cars-list.component.html',
  styleUrls: ['./cars-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    TabViewModule,
    TableModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    UserHeaderComponent
  ],
  providers: [ConfirmationService, MessageService]
})
export class CarCardsComponent implements OnInit {
  activeTabIndex = 0;
  selectedTabKey = 'pending';
  searchTerm: string = '';
  selectedCar: Cars | null = null;
  displayCarDialog: boolean = false;

  statusTabs = [
    { label: 'Pending', key: 'pending' },
    { label: 'Approved', key: 'approved' },
    { label: 'Rejected', key: 'rejected' },
    { label: 'Available Now', key: 'available' },
    { label: 'Rented Now', key: 'rented' },
    // { label: 'Under Maintenance', key: 'maintenance' }
  ];

  pendingCars: Cars[] = [];
  approvedCars: Cars[] = [];
  rejectedCars: Cars[] = [];
  availableCars: Cars[] = [];
  rentedCars: Cars[] = [];
  // maintenanceCars: Cars[] = [];

  constructor(
    private _AdmincarService: AdmincarsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  onTabChange(event: any) {
    this.selectedTabKey = this.statusTabs[event.index].key;
  }

  loadCars() {
    this._AdmincarService.getPendingCarsAdmin().subscribe(res => this.pendingCars = res);
    this._AdmincarService.getapprovedCarsAdmin().subscribe(res => this.approvedCars = res);
    this._AdmincarService.getRejectedCarsAdmin().subscribe(res => this.rejectedCars = res);
    this._AdmincarService.getAvailableCarsAdmin().subscribe(res => this.availableCars = res);
    this._AdmincarService.getRentedCarsAdmin().subscribe(res => this.rentedCars = res);
    // this._AdmincarService.getUnderMaintenanceCarsAdmin().subscribe(res => this.maintenanceCars = res);
  }

  getFilteredCars(): Cars[] {
    const term = this.searchTerm.toLowerCase();

    let currentList: Cars[] = [];
    switch (this.selectedTabKey) {
      case 'pending': currentList = this.pendingCars; break;
      case 'approved': currentList = this.approvedCars; break;
      case 'rejected': currentList = this.rejectedCars; break;
      case 'available': currentList = this.availableCars; break;
      case 'rented': currentList = this.rentedCars; break;
      // case 'maintenance': currentList = this.maintenanceCars; break;
    }

    return currentList.filter(car =>
      (car.brand + ' ' + car.model + ' ' + car.licensePlate + ' ' + car.type + ' ' + car.availabilityStatus)
        .toLowerCase()
        .includes(term)
    );
  }

  selectCar(car: Cars) {
    this.selectedCar = car;
    this.displayCarDialog = true;
  }

  confirmDeleteCar(carId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this car?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._AdmincarService.deleteCarAdmin(carId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Car deleted successfully' });
            this.loadCars();
            this.displayCarDialog = false;
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete car' });
          }
        });
      }
    });
  }

  approveCar(id: string) {
    this._AdmincarService.approveCarAdmin(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Approved', detail: 'Car approved successfully' });
        this.loadCars();
        this.displayCarDialog = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to approve car' });
      }
    });
  }

  rejectCar(id: string) {
    this._AdmincarService.rejectCarAdmin(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'warn', summary: 'Rejected', detail: 'Car rejected successfully' });
        this.loadCars();
        this.displayCarDialog = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to reject car' });
      }
    });
  }
}
