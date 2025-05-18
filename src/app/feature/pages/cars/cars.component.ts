import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { LayoutComponent } from '../../../core/pages/layout/layout.component';
import { FilterComponent } from '../../components/ui/filter/filter.component';
import { CarsService } from '../../../core/services/cars.service';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { CarSliderComponent } from '../../components/ui/car-slider/car-slider.component';
import { TabsModule } from 'primeng/tabs';
import { DividerModule } from 'primeng/divider';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FilterStateService } from '../../../core/services/filter-state.service';
import { FilterSidebarComponent } from '../../components/ui/filter-sidebar/filter-sidebar.component';
import { CommonModule } from '@angular/common';
import { Cars } from '../../../core/interfaces/cars';
import { CarService } from '../../../core/services/car.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cars',
  imports: [
    LayoutComponent,
    FilterComponent,
    CardComponent,
    DrawerModule,
    AvatarModule,
    CarSliderComponent,
    TabsModule,
    DividerModule,
    DatePickerModule,
    RadioButtonModule,
    FormsModule,
    ButtonModule,
    ToggleSwitchModule,
    FilterSidebarComponent,
    CommonModule,
    // Removed duplicate FormsModule
  ],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css',
})
export class CarsComponent implements OnInit, OnDestroy {
  visible: boolean = false;
  visible2: boolean = false;
  checked: boolean = false;
  selectedCar: Cars | null = null;

  pickupDate: Date | null = null;
  dropoffDate: Date | null = null;
  
  cars!: Cars[];
  filterdCars!: Cars[];
  _carService = inject(CarService);
  _filterService = inject(FilterStateService);
  isFavorite = false;
  insurance: string[] = [
    'No insurance',
    'Vehicle protection',
    '3rd Party liability',
  ];
  selectedInsurance: string = this.insurance[0];
  
  private subscriptions = new Subscription();

  get rentalDuration() {
    if (this.pickupDate && this.dropoffDate) {
      const diffTime = Math.abs(
        this.dropoffDate.getTime() - this.pickupDate.getTime()
      );
      return Math.ceil(diffTime / (1000 * 60 * 60));
    }
    return 0;
  }

  get totalPrice() {
    if (this.selectedCar && this.rentalDuration) {
      return this.selectedCar.totalPricePerHour * this.rentalDuration;
    }
    return 0;
  }

  showCarDetails(car: Cars | null) {
    this.selectedCar = car;
    this.visible = true;
  }

  onDrawerHide() {
    this.visible2 = false;
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  ngOnInit(): void {
    // Load cars first
    this.subscriptions.add(
      this._carService.getCars().subscribe({
        next: (cars) => {
          this.cars = cars;
          this.filterdCars = [...this.cars];
          
          // Then subscribe to filter changes
          this.subscriptions.add(
            this._filterService.currentFilters$.subscribe((filters) => {
              this.filterdCars = this._carService.filterCars(this.cars, filters);
            })
          );
        },
        error: (err) => {
          console.error('Error loading cars:', err);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}