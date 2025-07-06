import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { Orders } from '../../../../core/interfaces/orders';
import { OrdersService } from '../../../../core/services/orders.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
// import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';




@Component({
  selector: 'app-booking',
  imports: [TabViewModule, TableModule, CommonModule,ButtonModule , ConfirmDialogModule , ToastModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
  providers: [ConfirmationService, MessageService]
})
export class BookingComponent implements OnInit {

  constructor(private _OrdersService: OrdersService ,
  private confirmationService: ConfirmationService,
  private messageService: MessageService) { }

  allOrders: Orders[] = [];
  pendingOrders: Orders[] = [];
  cancelledOrders: Orders[] = [];

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


  


}
