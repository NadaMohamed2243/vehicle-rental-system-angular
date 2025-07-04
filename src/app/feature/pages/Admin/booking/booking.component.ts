import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { Orders } from '../../../../core/interfaces/orders';
import { OrdersService } from '../../../../core/services/orders.service';

@Component({
  selector: 'app-booking',
  imports: [TabViewModule, TableModule, CommonModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent implements OnInit {

  constructor(private _OrdersService: OrdersService) { }

  allOrders: Orders[] = [];
  pendingOrders: Orders[] = [];
  approvedOrders: Orders[] = [];
  cancelledOrders: Orders[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this._OrdersService.getAllOrdersAdmin().subscribe((res: Orders[]) => {
      this.allOrders = res;
      this.pendingOrders = res.filter(order => order.status === 'pending');
      this.approvedOrders = res.filter(order => order.status === 'approved');
      this.cancelledOrders = res.filter(order => order.status === 'cancelled');
    });
  }




}
