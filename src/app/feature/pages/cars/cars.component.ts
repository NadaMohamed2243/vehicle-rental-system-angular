import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { LayoutComponent } from '../../../core/pages/layout/layout.component';
import { FilterComponent } from '../../components/ui/filter/filter.component';
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
import { Subscription, Observable, switchMap } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MapComponent,
  Location,
} from '../../../shared/components/ui/map/map.component';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [
    CommonModule,
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
    MapComponent,
  ],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
})
export class CarsComponent implements OnInit, OnDestroy {
  // UI State
  visible: boolean = false;
  visible2: boolean = false;
  checked: boolean = false;
  isFavorite = false;
  isLoading = true;
  errorMessage: string | null = null;

  // Car Data
  cars: Cars[] = [];
  filteredCars: Cars[] = [];
  selectedCar: Cars | null = null;
  selectedCarLocation: Location | null = null;

  // Rental Details
  pickupDate: Date | null = null;
  dropoffDate: Date | null = null;
  insurance: string[] = [
    'No insurance',
    'Vehicle protection',
    '3rd Party liability',
  ];
  selectedInsurance: string = this.insurance[0];

  // Query Params
  filtration: string | null = null;
  type: string | null = null;
  brand: string | null = null;

  // Map related properties
  userLocation: Location | null = {
    lat: 31.408507,
    lng: 31.81227,
    address: 'Your current location',
  };
  selectedDeliveryLocation: Location | null = null;

  // Services
  private _carService = inject(CarService);
  private _filterService = inject(FilterStateService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private subscriptions = new Subscription();

  // Computed properties
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

  ngOnInit(): void {
    this.loadInitialData();
    this.setupFilterSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadInitialData(): void {
    this.subscriptions.add(
      this._route.queryParams
        .pipe(
          switchMap((params) => {
            this.filtration = params['filtration'] || null;
            this.type = params['type'] || null;
            this.brand = params['brand'] || null;

            return this.loadCars();
          })
        )
        .subscribe({
          next: (cars) => {
            this.cars = cars;
            this.filteredCars = [...this.cars];
            this.isLoading = false;
            this.errorMessage = null;
          },
          error: (err) => {
            console.error('Error loading cars:', err);
            this.isLoading = false;
            this.errorMessage = 'Failed to load cars. Please try again later.';
            this.cars = [];
            this.filteredCars = [];
          },
        })
    );
  }

  private setupFilterSubscription(): void {
    this.subscriptions.add(
      this._filterService.currentFilters$.subscribe((filters) => {
        if (this.cars.length) {
          this.filteredCars = this._carService.filterCars(this.cars, filters);
        }
      })
    );
  }

  loadCars(): Observable<Cars[]> {
    this.isLoading = true;
    this.errorMessage = null;

    if (this.type) {
      return this._carService.getCarsByType(this.type);
    } else if (this.brand) {
      return this._carService.getCarsByBrand(this.brand);
    } else if (this.filtration === 'most-popular') {
      return this._carService.getMostPopularCars();
    } else if (this.filtration === 'NearBy') {
      return this._carService.getNearByCars();
    } else {
      return this._carService.getCars();
    }
  }

  showCarDetails(car: Cars | null): void {
    this.selectedCar = car;
    this.visible = true;
    if (car) {
      this.selectedCarLocation = {
        lat: car.agent.lat,
        lng: car.agent.lng,
        address: car.agent.location,
      };
    } else {
      this.selectedCarLocation = null;
    }
  }

  onDrawerHide(): void {
    this.visible2 = false;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  onDeliveryLocationSelected(location: Location) {
    this.selectedDeliveryLocation = location;
    console.log('Delivery location selected:', location);
  }
}
