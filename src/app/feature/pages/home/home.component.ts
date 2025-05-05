import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from "../../../shared/components/ui/card/card.component";
import { Car } from '../../../core/interfaces/car';
import { CarsService } from '../../../core/services/cars.service';



@Component({
  selector: 'app-home',
  imports: [CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  cars!:Car[]
  _carsService=inject(CarsService)

  ngOnInit(): void {
    this.cars=this._carsService.getCars();
  }
}
