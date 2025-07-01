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
import { GeoLocationService } from '../../../core/services/geo-location.service';
import { Subscription, Observable, switchMap } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MapComponent,
  Location,
} from '../../../shared/components/ui/map/map.component';
import { ToastModule } from 'primeng/toast';
import {
  BookingService,
  BookingRequest,
} from '../../../core/services/booking.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

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
    ToastModule,
  ],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
  providers: [MessageService],
})
export class CarsComponent implements OnInit, OnDestroy {
  // UI State
  visible: boolean = false;
  visible2: boolean = false;
  withDriver: boolean = false;
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
  userLocation: Location | null = null;
  selectedDeliveryLocation: Location | null = null;

  // Booking state
  isBooking = false;

  // Services
  private _carService = inject(CarService);
  private _filterService = inject(FilterStateService);
  private _geoLocationService = inject(GeoLocationService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _bookingService = inject(BookingService);
  private _messageService = inject(MessageService);
  private _authService = inject(AuthService);
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
    return this.calculateTotalCost();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupFilterSubscription();
    this.getUserLocation();
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

  private getUserLocation(): void {
    this.subscriptions.add(
      this._geoLocationService.getLocation().subscribe({
        next: (location) => {
          this.userLocation = {
            lat: location.latitude,
            lng: location.longitude,
            address: location.city,
          };
          console.log('User location loaded:', this.userLocation);
        },
        error: (err) => {
          console.error('Error getting user location:', err);
          // Fallback to default location (Mansoura)
          this.userLocation = {
            lat: 31.408507,
            lng: 31.81227,
            address: 'Default location',
          };
        },
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

  private formatDateForAPI(date: Date): string {
    return date.toISOString();
  }

  private calculateTotalCost(): number {
    if (!this.selectedCar || !this.rentalDuration) return 0;

    let baseCost = this.selectedCar.totalPricePerHour * this.rentalDuration;

    if (this.withDriver) {
      const driverCostPerHour = 25;
      baseCost += driverCostPerHour * this.rentalDuration;
    }

    if (this.selectedInsurance !== 'No insurance') {
      baseCost += 52;
    }

    baseCost += 13.06;

    return baseCost;
  }

  bookVehicle(): void {
    if (!this.selectedCar || !this.pickupDate || !this.dropoffDate) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please select pickup and drop-off dates',
      });
      return;
    }

    const token = this._authService.getToken();

    if (!token) {
      this._messageService.add({
        severity: 'error',
        summary: 'Authentication Required',
        detail: 'Please log in to book a vehicle',
      });
      return;
    }

    this.isBooking = true;

    const bookingData: BookingRequest = {
      carId: this.selectedCar._id,
      startDate: this.formatDateForAPI(this.pickupDate),
      endDate: this.formatDateForAPI(this.dropoffDate),
      totalCost: this.calculateTotalCost(),
      pickupLocation:
        this.selectedCarLocation?.address || this.selectedCar.agent.location,
      dropoffLocation:
        this.selectedDeliveryLocation?.address ||
        this.selectedCarLocation?.address ||
        this.selectedCar.agent.location,
    };
    // if (this.withDriver && this.selectedCar.driver_rate_per_hour) {
    //   bookingData.totalCost +=
    //     this.selectedCar.driver_rate_per_hour * this.rentalDuration;
    // }
    this.subscriptions.add(
      this._bookingService.bookAndPay(bookingData).subscribe({
        next: (response) => {
          this.isBooking = false;

          if (response.booking && response.iframeUrl) {
            this._messageService.add({
              severity: 'success',
              summary: 'Booking Created Successfully',
              detail: `Booking ID: ${response.booking._id}. Redirecting to payment...`,
            });

            setTimeout(() => {
              window.location.href = response.iframeUrl;
            }, 2000);

            this.visible = false;
          } else {
            this._messageService.add({
              severity: 'error',
              summary: 'Booking Failed',
              detail: 'Invalid response from server',
            });
          }
        },
        error: (error) => {
          this.isBooking = false;
          console.error('Booking error:', error);

          let errorMessage = 'Failed to book the vehicle. Please try again.';

          if (error.error?.message) {
            errorMessage = error.error.message;
          }

          this._messageService.add({
            severity: 'error',
            summary: 'Booking Error',
            detail: errorMessage,
          });
        },
      })
    );
  }
}
