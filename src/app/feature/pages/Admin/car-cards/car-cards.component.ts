import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { AdmincarsService } from '../../../../core/services/admincars.service';
import { Car } from '../../../../core/interfaces/car';


@Component({
  selector: 'app-admin-car-card',
  standalone: true,
  imports: [CommonModule, FormsModule, TabViewModule, CardModule],
  templateUrl: './car-cards.component.html',
  styleUrl: './car-cards.component.css',
})
export class CarCardsComponent implements OnInit {
  constructor(private _AdmincarService: AdmincarsService,private router: Router) {}
  cars: Car[] = [];
  availableCars: Car[] = [];
  occupiedCars: Car[] = [];
  selectedCar: any = null;

  
  ngOnInit(): void {
    this.loadCars();
  }
//load cars from the service
  loadCars() {
    this.cars = this._AdmincarService.getAllCars();
    this.availableCars = this._AdmincarService.getAvailableCars();
    this.occupiedCars = this._AdmincarService.getOccupiedCars();
  }

  // to open car card details
  selectCar(car: any) {
    this.selectedCar = car;
  }

  editCar(car: any) {
  this.router.navigateByUrl('dashboard/add-car', {
    state: { car }
  });
}

}