// import { Component, inject, OnInit } from '@angular/core';
// import { CardComponent } from '../../../shared/components/ui/card/card.component';
// import { MostPopularComponent } from '../../components/most-popular/most-popular.component';
// import { NearbyCarsComponent } from '../../components/nearby-cars/nearby-cars.component';
// import { CarTypesComponent } from '../../components/car-types/car-types.component';
// import { CarBrandsComponent } from '../../components/car-brands/car-brands.component';
// import { PromoCardsComponent } from '../../components/promo-cards/promo-cards.component';
// import { LayoutComponent } from '../../../core/pages/layout/layout.component';
// import { FooterComponent } from '../../../core/layout/footer/footer.component';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CarService } from '../../../core/services/car.service';
// import { Cars } from '../../../core/interfaces/cars';

// @Component({
//   selector: 'app-home',
//   imports: [
//     MostPopularComponent,
//     NearbyCarsComponent,
//     CarBrandsComponent,
//     PromoCardsComponent,
//     LayoutComponent,
//     FooterComponent,
//   ],
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.css',
// })
// export class HomeComponent {
//   _carService = inject(CarService);
//   selectedCar: Cars | null = null;
//   visible = false;

//   constructor(private route: ActivatedRoute, private router: Router) {}

//   ngOnInit(): void {
//     // Subscribe to selectedCar changes
//     this._carService.getSelectedCar().subscribe((car) => {
//       if (car) {
//         this.selectedCar = car;
//         this.visible = true; // Show the slider
//         console.log('Selected car changed:', car);
//       }
//     });

//     this.route.queryParams.subscribe((params) => {
//       const token = params['token'];
//       if (token) {
//         localStorage.setItem('token', token);
//         // Optionally remove token from URL
//         this.router.navigate([], { queryParams: {} });
//       }
//     });


//   }
// }


import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { LayoutComponent } from '../../../core/pages/layout/layout.component';
import { MostPopularComponent } from '../../components/most-popular/most-popular.component';
import { NearbyCarsComponent } from '../../components/nearby-cars/nearby-cars.component';
import { CarBrandsComponent } from '../../components/car-brands/car-brands.component';
import { PromoCardsComponent } from '../../components/promo-cards/promo-cards.component';
import { FooterComponent } from '../../../core/layout/footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../core/services/car.service';
import { Cars } from '../../../core/interfaces/cars';
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
import { CommonModule } from '@angular/common';
import { GeoLocationService } from '../../../core/services/geo-location.service';
import { Subscription, Observable } from 'rxjs';
import { MapComponent, Location } from '../../../shared/components/ui/map/map.component';
import { ToastModule } from 'primeng/toast';
import { BookingService, BookingRequest } from '../../../core/services/booking.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MostPopularComponent,
    NearbyCarsComponent,
    CarBrandsComponent,
    PromoCardsComponent,
    LayoutComponent,
    FooterComponent,
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
    MapComponent,
    ToastModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService],
})
export class HomeComponent implements OnInit, OnDestroy {
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
      return;
    }

    // Validate token expiration before proceeding
    // if (this._authService.isTokenExpired(token)) {
    //   this._messageService.add({
    //     severity: 'error',
    //     summary: 'Session Expired',
    //     detail: 'Your session has expired. Please log in again.',
    //   });
    //   this._authService.logout();
    //   this._router.navigate(['/auth/login']);
    //   return;
    // }

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
            // Handle expired token
            this._messageService.add({
              severity: 'error',
              summary: 'Session Expired',
              detail: 'Your session has expired. Please log in again.',
            });

            // this._authService.logout();
            this._router.navigate(['/auth/login']);
          } else {
            // Handle other errors
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
