import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { HeroComponent } from '../../../shared/components/ui/hero/hero.component';
import { BrandIconsComponent } from './components/brand-icons/brand-icons.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { WhyChooseMeshwarkComponent } from './components/why-choose-rently/why-choose-rently.component';
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
import { MapComponent, Location } from '../../../shared/components/ui/map/map.component';
import { BookingService, BookingRequest } from '../../../core/services/booking.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { AgreementService } from '../../../core/services/agreement.service';
import { SafeUrlPipe } from '../../../shared/pipes/safe-url.pipe';
import { DialogModule } from 'primeng/dialog';
import { SignatureCanvasComponent } from '../../../shared/components/ui/signature-canvas/signature-canvas.component';
import { CarCategoryComponent } from "../../components/car-category/car-category.component";

@Component({
  selector: 'app-landing',
  imports: [
    NavbarComponent,
    HeroComponent,
    BrandIconsComponent,
    HowItWorksComponent,
    WhyChooseMeshwarkComponent,
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
    SafeUrlPipe,
    DialogModule,
    SignatureCanvasComponent,
    CarCategoryComponent
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

  // Date validation properties
  minDate: Date = new Date();
  minDropoffDate: Date = new Date();

  // Map related properties
  userLocation: Location | null = null;
  selectedDeliveryLocation: Location | null = null;
  private pendingCarIdFromRedirect: string | null = null;

  // Booking state
  isBooking = false;

  // Car booking history
  carBookingHistory: any[] = [];
  isLoadingBookingHistory = false;

  // Agreement state
  agreement: any = null;
  showAgreementModal: boolean = false;

  // Signature data
  signatureData: string = '';

  // Add payment URL storage
  private pendingPaymentUrl: string = '';

  // Loading states
  isSubmittingSignature: boolean = false;
  isDownloading: boolean = false;
  isProcessingPayment: boolean = false;

  // Add browser check property
  isBrowser: boolean;

  // Services
  private _carService = inject(CarService);
  private _geoLocationService = inject(GeoLocationService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _bookingService = inject(BookingService);
  private _messageService = inject(MessageService);
  private _authService = inject(AuthService);
  private _agreementService = inject(AgreementService);
  private subscriptions = new Subscription();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

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
    this.minDate = new Date();

    // Subscribe to selectedCar changes
    this.subscriptions.add(
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
            this.loadCarBookingHistory(car._id);
          } else {
            this.selectedCarLocation = null;
            this.carBookingHistory = [];
          }
        }
      })
    );

    this.subscriptions.add(
      this._route.queryParams.subscribe((params) => {
        const token = params['token'];
        if (token) {
          localStorage.setItem('token', token);
          // Optionally remove token from URL
          this._router.navigate([], { queryParams: {} });
        }

        // Restore booking data from query params if present
        const pickupDateParam = params['pickupDate'];
        const dropoffDateParam = params['dropoffDate'];
        const locationParam = params['location'];
        const carIdParam = params['carId'];

        if (pickupDateParam) {
          this.pickupDate = new Date(pickupDateParam);
        }

        if (dropoffDateParam) {
          this.dropoffDate = new Date(dropoffDateParam);
        }

        if (locationParam) {
          this.selectedCarLocation = {
            lat: 0,
            lng: 0,
            address: locationParam,
          };
        }

        this.pendingCarIdFromRedirect = carIdParam;
      })
    );

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

  bookVehicle(): void {
    if (!this.selectedCar) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Missing Information',
        detail: 'Please select a car',
      });
      return;
    }

    if (!this.validateDates()) {
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
      startDate: this.formatDateForAPI(this.pickupDate!),
      endDate: this.formatDateForAPI(this.dropoffDate!),
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
            this.pendingPaymentUrl = response.iframeUrl;

            this._messageService.add({
              severity: 'success',
              summary: 'Booking Created Successfully',
              detail: `Booking ID: ${response.booking._id}. Please sign the agreement to proceed to payment.`,
            });

            this._agreementService
              .generateAgreement(response.booking._id)
              .subscribe({
                next: (res) => {
                  this.agreement = res.agreement;
                  this.showAgreementModal = true;
                },
                error: (err) => {
                  this._messageService.add({
                    severity: 'warn',
                    summary: 'Agreement Generation Failed',
                    detail: 'Proceeding to payment without digital agreement.',
                  });
                  this.proceedToPayment();
                },
              });
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

  onSignatureChange(signature: string) {
    if (signature && signature.length > 100) {
      console.log('Signature preview:', signature.substring(0, 50) + '...');
      this.signatureData = signature;
    } else {
      this.signatureData = '';
    }
  }

  onSignatureStart() {
    console.log('drawing started');
  }

  onSignatureEnd() {
    console.log('drawing ended');
  }

  submitSignature() {
    if (!this.agreement || !this.signatureData) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Missing Signature',
        detail: 'Please provide your signature before submitting',
      });
      return;
    }

    if (this.isSignatureEmpty(this.signatureData)) {
      console.log('❌ Signature is empty');
      this._messageService.add({
        severity: 'warn',
        summary: 'Empty Signature',
        detail: 'Please draw your signature in the provided area',
      });
      return;
    }

    console.log('✅ Submitting signature to backend...');
    this.isSubmittingSignature = true;

    this._agreementService
      .signAgreement(this.agreement.id, this.signatureData)
      .subscribe({
        next: (res) => {
          this.agreement = res.agreement;
          this.isSubmittingSignature = false;
          this._messageService.add({
            severity: 'success',
            summary: 'Agreement Signed Successfully',
            detail: 'Your digital signature has been embedded in the agreement.',
          });

          this.refreshAgreement();
        },
        error: (err) => {
          this.isSubmittingSignature = false;
          this._messageService.add({
            severity: 'error',
            summary: 'Signing Failed',
            detail:
              err.error?.message ||
              'Failed to sign agreement. Please try again.',
          });
        },
      });
  }

  private isSignatureEmpty(signatureData: string): boolean {
    const emptyCanvasData = [
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=',
    ];

    if (emptyCanvasData.includes(signatureData)) {
      return true;
    }

    const base64Data = signatureData.split(',')[1];
    if (base64Data && base64Data.length < 100) {
      return true;
    }

    return false;
  }

  private refreshAgreement() {
    if (!this.agreement) return;

    this._agreementService.getAgreement(this.agreement.id).subscribe({
      next: (updatedAgreement) => {
        this.agreement = updatedAgreement;
      },
      error: (err) => {
        console.error('Error refreshing agreement:', err);
      },
    });
  }

  reviewSignedDocument() {
    if (!this.agreement) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Document Not Available',
        detail: 'Agreement document is not available for review.',
      });
      return;
    }

    const documentUrl =
      this.agreement.signedDocumentUrl || this.agreement.documentUrl;

    if (!documentUrl) {
      this._messageService.add({
        severity: 'warn',
        summary: 'Document Not Available',
        detail: 'Signed document is not yet available for review.',
      });
      return;
    }

    window.open(
      documentUrl,
      '_blank',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );
  }

  downloadAgreement() {
    if (!this.agreement) return;

    this.isDownloading = true;
    console.log('Downloading agreement:', this.agreement);

    this._agreementService.downloadAgreement(this.agreement._id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const fileName =
          this.agreement.status === 'signed'
            ? `signed_agreement_${this.agreement.id}_${
                new Date().toISOString().split('T')[0]
              }.pdf`
            : `agreement_${this.agreement.id}_${
                new Date().toISOString().split('T')[0]
              }.pdf`;

        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.isDownloading = false;
        this._messageService.add({
          severity: 'success',
          summary: 'Download Complete',
          detail: 'Agreement document has been downloaded successfully.',
        });
      },
      error: (err) => {
        this.isDownloading = false;
        this._messageService.add({
          severity: 'error',
          summary: 'Download Failed',
          detail: 'Failed to download agreement. Please try again.',
        });
      },
    });
  }

  proceedToPayment() {
    if (!this.pendingPaymentUrl) {
      this._messageService.add({
        severity: 'error',
        summary: 'Payment Error',
        detail: 'Payment URL not available. Please try booking again.',
      });
      return;
    }

    this.isProcessingPayment = true;

    this._messageService.add({
      severity: 'info',
      summary: 'Redirecting to Payment',
      detail: 'You will be redirected to complete your payment...',
    });

    this.showAgreementModal = false;

    setTimeout(() => {
      window.location.href = this.pendingPaymentUrl;
    }, 1500);
  }

  closeAgreementModal() {
    if (this.agreement && this.agreement.status === 'signed') {
      if (
        confirm('Agreement is signed. Do you want to proceed to payment now?')
      ) {
        this.proceedToPayment();
      } else {
        this.showAgreementModal = false;
        this.agreement = null;
      }
    } else {
      this._messageService.add({
        severity: 'info',
        summary: 'Agreement Not Signed',
        detail:
          'You can proceed to payment without signing, but the agreement will remain unsigned.',
      });

      if (
        confirm(
          'Do you want to proceed to payment without signing the agreement?'
        )
      ) {
        this.proceedToPayment();
      }
    }
  }

  skipSigningAndProceed() {
    const confirmed = confirm(
      'Are you sure you want to proceed without signing the agreement? You can sign it later from your booking history.'
    );

    if (confirmed) {
      this._messageService.add({
        severity: 'info',
        summary: 'Skipped Agreement Signing',
        detail: 'Proceeding to payment without digital signature.',
      });

      this.showAgreementModal = false;
      this.proceedToPayment();
    }
  }
}
