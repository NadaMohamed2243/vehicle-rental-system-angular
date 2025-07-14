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
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';

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
    NavbarComponent,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [MessageService],
})
export class SearchComponent implements OnInit, OnDestroy {
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
  location: string | null = null;
  insurance: string[] = [
    'No insurance',
    'Vehicle protection',
    '3rd Party liability',
  ];
  selectedInsurance: string = this.insurance[0];

  // Date validation properties
  minDate: Date = new Date();
  minDropoffDate: Date = new Date();

  // Query Params
  filtration: string | null = null;
  type: string | null = null;
  brand: string | null = null;

  // Map related properties
  userLocation: Location | null = null;
  selectedDeliveryLocation: Location | null = null;

  // Booking state
  isBooking = false;

  // Car booking history
  carBookingHistory: any[] = [];
  isLoadingBookingHistory = false;

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
    this.minDate = new Date();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadInitialData(): void {
    this.subscriptions.add(
      this._route.queryParams
        .pipe(
          switchMap((params) => {
            this.location = params['location'] || null;
            this.pickupDate = params['pickupDate']
              ? new Date(params['pickupDate'])
              : null;
            this.dropoffDate = params['returnDate']
              ? new Date(params['returnDate'])
              : null;
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

    if (this.location && this.pickupDate && this.dropoffDate) {
      return this._carService.getAvailableCars(
        this.location,
        this.pickupDate,
        this.dropoffDate
      );
    }

    // Existing filters
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
      this.loadCarBookingHistory(car._id);
    } else {
      this.selectedCarLocation = null;
      this.carBookingHistory = [];
    }
  }

  loadCarBookingHistory(carId: string): void {
    this.isLoadingBookingHistory = true;
    this.carBookingHistory = [];

    this.subscriptions.add(
      this._bookingService.getCarBookingHistory(carId).subscribe({
        next: (bookings) => {
          this.carBookingHistory = bookings.sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
          this.isLoadingBookingHistory = false;
        },
        error: (error) => {
          console.error('Error loading car booking history:', error);
          this.isLoadingBookingHistory = false;
        },
      })
    );
  }

  isFutureBooking(dateString: string): boolean {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate > today;
  }

  formatBookingDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  onDrawerHide(): void {
    this.visible2 = false;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  onDeliveryLocationSelected(location: Location) {
    if (!this.isDeliverySelectionAllowed()) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Delivery Not Available',
        detail:
          'Delivery location selection is only available for cars with driver option.',
      });
      return;
    }

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

  onPickupDateChange(): void {
    if (this.pickupDate) {
      this.minDropoffDate = new Date(
        this.pickupDate.getTime() + 60 * 60 * 1000
      );

      if (this.dropoffDate && this.dropoffDate <= this.pickupDate) {
        this.dropoffDate = null;
      }
    }
  }

  onDropoffDateChange(): void {
    if (
      this.dropoffDate &&
      this.pickupDate &&
      this.dropoffDate <= this.pickupDate
    ) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Invalid Date',
        detail: 'Drop-off date must be after pickup date',
      });
      this.dropoffDate = null;
    }
  }

  private validateDates(): boolean {
    const now = new Date();

    if (!this.pickupDate || !this.dropoffDate) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please select both pickup and drop-off dates',
      });
      return false;
    }

    if (this.pickupDate < now) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Invalid Date',
        detail: 'Pickup date cannot be in the past',
      });
      return false;
    }

    if (this.dropoffDate <= this.pickupDate) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Invalid Date',
        detail: 'Drop-off date must be after pickup date',
      });
      return false;
    }

    return true;
  }

  isValidDateRange(): boolean {
    if (!this.pickupDate || !this.dropoffDate) {
      return false;
    }

    const now = new Date();
    return this.pickupDate >= now && this.dropoffDate > this.pickupDate;
  }

  private getCurrentLanguage(): string {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  }

  bookVehicle(): void {
    const currentLanguage = this.getCurrentLanguage();

    localStorage.setItem(
      'pendingBooking',
      JSON.stringify({
        redirect: 'cars',
        carId: this.selectedCar ? this.selectedCar._id : '',
        pickupDate: this.pickupDate?.toISOString(),
        dropoffDate: this.dropoffDate?.toISOString(),
        location: this.selectedCarLocation?.address || '',
        language: currentLanguage,
      })
    );

    this._router.navigate(['/register']);
  }

  isDeliverySelectionAllowed(): boolean {
    return !!this.selectedCar?.with_driver;
  }

  canUseDeliveryLocation(): boolean {
    return this.isDeliverySelectionAllowed() && this.withDriver;
  }
}
