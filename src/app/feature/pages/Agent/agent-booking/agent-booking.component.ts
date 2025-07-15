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
import { BookingService } from '../../../../core/services/booking.service';


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
  private _bookingService: BookingService,
  private messageService: MessageService) { }

  allOrders: Orders[] = [];
  paidOrders: Orders[] = [];
  pendingOrders: Orders[] = [];
  cancelledOrders: Orders[] = [];
  bookingSearchTerm: string = '';
  ongoingOrders: Orders[] = [];
upcomingOrders: Orders[] = [];
completedOrders: Orders[] = [];
overdueOrders: Orders[] = [];



  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this._OrdersService.getAllOrdersAgent().subscribe((res: Orders[]) => {
      this.allOrders = res;
      console.log(res);
      this.paidOrders = res.filter(order => order.status === 'paid');
      this.pendingOrders = res.filter(order => order.status === 'pending');
      this.cancelledOrders = res.filter(order => order.status === 'cancelled');
    this.completedOrders = res.filter(order => order.status === 'completed');

    const now = new Date();

   this.ongoingOrders = res
  .filter(order => {
    const start = new Date(order.startDate);
    const end = new Date(order.endDate);
    const isBetweenDates = start <= now && end >= now;
    const isRentedAndPaid = typeof order.carId !== 'string' &&
                            order.carId.availabilityStatus === 'Rented' &&
                            order.status === 'paid';
    return isRentedAndPaid || (order.status === 'paid' && isBetweenDates);
  })
  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

this.upcomingOrders = res
  .filter(order =>
    new Date(order.startDate) > now && order.status === 'paid'
  )
  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    this.overdueOrders = res.filter(order =>
      new Date(order.endDate) < now && !['completed', 'cancelled'].includes(order.status)
    );
    });
  }

markAsCompleted(orderId: string) {
  this._bookingService.completeBooking(orderId).subscribe({
    next: () => {
      this.loadOrders(); // Refresh list
      this.messageService.add({ severity: 'success', summary: 'Completed', detail: 'Booking marked as completed' });
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'Failed to complete booking' });
    }
  });
}

returnCar(order: any) {
  this._bookingService.markAsReturned(order._id).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Car Returned' });
      this.loadOrders();
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error returning car' });
    }
  });
}
returnAndComplete(order: any) {
  this._bookingService.returnAndComplete(order._id).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Booking completed & car returned' });
      this.loadOrders();
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Failed to complete action', detail: err.error.message });
    }
  });
}


completeBooking(order: any) {
  if (order.carId.availabilityStatus !== 'Available') {
    this.messageService.add({ severity: 'warn', summary: 'Car must be returned first' });
    return;
  }

  this._bookingService.completeBooking(order._id).subscribe({
    next: (res) => {
      this.messageService.add({ severity: 'success', summary: 'Booking Completed' });
      this.loadOrders();
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Error completing booking' });
    }
  });
}
markAsRented(order: any) {
  this._bookingService.markAsRented(order._id).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Car marked as rented' });
      this.loadOrders();
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Failed to mark as rented', detail: err.error.message });
    }
  });
}

cancelOrder(order: any) {
  this._OrdersService.cancelOrder(order._id).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Booking cancelled' });
      this.loadOrders();
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Failed to cancel booking', detail: err.error.message });
    }
  });
}

canCancel(order: any): boolean {
  const now = new Date();
  return new Date(order.startDate) > now && order.status === 'paid';
}
cancelAndRefund(order: any) {
  this._bookingService.refundBooking(order._id).subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Booking cancelled and refunded' });
      this.loadOrders();
    },
    error: (err) => {
      this.messageService.add({ severity: 'error', summary: 'Failed to cancel and refund booking', detail: err.error.message });
    }
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
