import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { HeroComponent } from '../../../shared/components/ui/hero/hero.component';
import { BrandIconsComponent } from './components/brand-icons/brand-icons.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { WhyChooseRentlyComponent } from './components/why-choose-rently/why-choose-rently.component';
import { FeaturedCarsComponent } from '../../components/featured-cars/featured-cars.component';
import { CarTypesComponent } from '../../components/car-types/car-types.component';
import { PromoCardsComponent } from '../../components/promo-cards/promo-cards.component';
import { FooterComponent } from '../../../core/layout/footer/footer.component';

import { CarSliderComponent } from '../../components/ui/car-slider/car-slider.component';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { DividerModule } from 'primeng/divider';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule } from '@angular/common';
import { CarService } from '../../../core/services/car.service';
import { Cars } from '../../../core/interfaces/cars';
import { GeoLocationService } from '../../../core/services/geo-location.service';
import { Subscription } from 'rxjs';
import {
  MapComponent,
  Location,
} from '../../../shared/components/ui/map/map.component';
import {
  BookingService,
  BookingRequest,
} from '../../../core/services/booking.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [
    NavbarComponent,
    HeroComponent,
    BrandIconsComponent,
    HowItWorksComponent,
    WhyChooseRentlyComponent,
    FeaturedCarsComponent,
    CarTypesComponent,
    PromoCardsComponent,
    FooterComponent,
    CarSliderComponent,
    DrawerModule,
    AvatarModule,
    TabsModule,
    DividerModule,
    DatePickerModule,
    RadioButtonModule,
    FormsModule,
    ButtonModule,
    ToggleSwitchModule,
    MapComponent,
    ToastModule,
    CommonModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
  providers: [MessageService],
})
export class LandingComponent implements OnInit, OnDestroy {
  // UI State
  visible: boolean = false;
  withDriver: boolean = false;
  isFavorite = false;
  isLoading = true;
  errorMessage: string | null = null;

  // Car Data
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

  // Map related properties
  userLocation: Location | null = null;
  selectedDeliveryLocation: Location | null = null;

  // Booking state
  isBooking = false;

  // Services
  private _carService = inject(CarService);
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
    // Subscribe to selectedCar changes
    this._carService.getSelectedCar().subscribe((car) => {
      if (car) {
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
    });

    this._route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        localStorage.setItem('token', token);
        // Optionally remove token from URL
        this._router.navigate([], { queryParams: {} });
      }
    });

    this.getUserLocation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
      this._router.navigate(['/login']);
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

          if (error.status === 400 && error.error?.error === 'Invalid Token') {
            this._messageService.add({
              severity: 'error',
              summary: 'Session Expired',
              detail: 'Your session has expired. Please log in again.',
            });
            this._router.navigate(['/login']);
          } else {
            let errorMessage = 'Failed to book the vehicle. Please try again.';
            if (error.error?.message) {
              errorMessage = error.error.message;
            }

            this._messageService.add({
              severity: 'error',
              summary: 'Booking Error',
              detail: errorMessage,
            });
          }
        },
      })
    );
  }
}
