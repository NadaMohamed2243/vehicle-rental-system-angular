import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { AdmincarsService } from '../../../../core/services/admincars.service';
import { Cars } from '../../../../core/interfaces/cars';


@Component({
  selector: 'app-admin-car-card',
  standalone: true,
  imports: [CommonModule, FormsModule, TabViewModule, CardModule],
  templateUrl: './car-cards.component.html',
  styleUrl: './car-cards.component.css',
})
export class CarCardsComponent implements OnInit {
  constructor(private _AdmincarService: AdmincarsService,private router: Router) {}
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

  this._AdmincarService.getRentedCars().subscribe((res: Cars[]) => {
    this.occupiedCars = res;
  });
  }

  // to open car card details
  selectCar(car: Cars) {
    this.selectedCar = car;
  }

  editCar(car: Cars) {
  this.router.navigateByUrl('dashboard/add-car', {
    state: { car }
  });
}

}