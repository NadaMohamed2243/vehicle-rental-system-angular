import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentResultService } from '../../../core/services/payment-result.service';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-payment-result',
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.css'],
  imports: [RouterModule, CommonModule]
})
export class PaymentResultComponent {
  status: string | null = null;
  bookingId: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  showResult: boolean = false;
  failedError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private paymentResultService: PaymentResultService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Only run API logic in the browser, not during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.fetchdata();
  }
  fetchdata(){
     this.route.queryParams.subscribe(params => {

      const bookingId = params['bookingId'];
      console.log("bookingId from URL:", bookingId);
      this.status = null;
      this.error = null;
      this.isLoading = false;

      if (!bookingId) {
        this.status = 'invalid';
        this.error = 'Missing booking ID in the link.';
        return;
      }

      this.bookingId = bookingId;
      this.isLoading = true;

      this.paymentResultService.getPaymentStatus(this.bookingId).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.status = res.status;
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 400 || err.status === 404) {
            this.status = 'invalid';
            this.error = err.error?.error || 'Invalid booking link.';
          } else {
            this.status = 'unknown';
            this.error = 'Something went wrong. Please try again later.';
          }
          console.error('Error fetching payment status:', err);
        }
      });
    });
  }
  navigateToPayment(){
    this.paymentResultService.resumePayment(this.bookingId).subscribe({
    next: (res) => {
      // Redirect the user to resumed payment page
      window.location.href = res.redirectUrl;
    },
    error: (err) => {
      console.error('Failed to resume payment:', err);
      this.failedError = 'Unable to retry payment at this time. Please try again later.';
      setTimeout(() => {
        this.failedError = null; // Clear the error after 5 seconds
      }, 4000);
    }
  });
}
}
