import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { Orders } from '../../../../core/interfaces/orders';
import { OrdersService } from '../../../../core/services/orders.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { UserHeaderComponent } from '../../user-header/user-header.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-agent-booking',
  imports: [TabViewModule, TableModule, CommonModule,ButtonModule , ConfirmDialogModule , ToastModule,UserHeaderComponent,FormsModule],
  templateUrl: './agent-booking.component.html',
  styleUrl: './agent-booking.component.css',
  providers: [ConfirmationService, MessageService]
})
export class AgentBookingComponent implements OnInit {

  constructor(private _OrdersService: OrdersService ,
  private confirmationService: ConfirmationService,
  private messageService: MessageService) { }

  allOrders: Orders[] = [];
  pendingOrders: Orders[] = [];
  cancelledOrders: Orders[] = [];
  bookingSearchTerm: string = '';

   

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this._OrdersService.getAllOrdersAdmin().subscribe((res: Orders[]) => {
      this.allOrders = res;
      this.pendingOrders = res.filter(order => order.status === 'pending');
      this.cancelledOrders = res.filter(order => order.status === 'cancelled');
    });
  }

  cancelOrder(orderId: string) {
  this._OrdersService.cancelOrder(orderId).subscribe(() => {
    this.loadOrders();
  });
}


  confirmDelete(orderId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this booking?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._OrdersService.deleteOrder(orderId).subscribe({
          next: () => {
            this.loadOrders();
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Booking deleted successfully' });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete booking' });
          }
        });
      }
    });
  }


   filteredBookings() {
      if (!this.bookingSearchTerm) return this.allOrders;

      const term = this.bookingSearchTerm.toLowerCase();

      return this.allOrders.filter(order => {
        const car = typeof order.carId === 'object' && order.carId !== null
          ? order.carId as { brand?: string, model?: string, licensePlate?: string }
          : {};

        return (
          order.billingName?.toLowerCase().includes(term) ||
          order.billingPhone?.toLowerCase().includes(term) ||
          car.brand?.toLowerCase().includes(term) ||
          car.model?.toLowerCase().includes(term) ||
          car.licensePlate?.toLowerCase().includes(term)
        );
      });
    }


}
