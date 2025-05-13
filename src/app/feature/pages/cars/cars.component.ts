import { Component, inject, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../core/pages/layout/layout.component';
import { FilterComponent } from '../../components/ui/filter/filter.component';
import { Car } from '../../../core/interfaces/car';
import { CarsService } from '../../../core/services/cars.service';
import { CardComponent } from '../../../shared/components/ui/card/card.component';

@Component({
  selector: 'app-cars',
  imports: [LayoutComponent, FilterComponent, CardComponent],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css',
})
export class CarsComponent implements OnInit {
  cars!: Car[];
  _carsService = inject(CarsService);

  ngOnInit(): void {
    this.cars = this._carsService.getCars();
  }
}
