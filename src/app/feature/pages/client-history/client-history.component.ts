import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../core/pages/layout/layout.component';
import { HistoryService } from '../../../core/services/history.service';
import { Booking } from '../../../core/services/history.service';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-client-history',
  standalone: true,
  imports: [LayoutComponent, CommonModule, ToastModule],
  templateUrl: './client-history.component.html',
  styleUrl: './client-history.component.css',
  providers: [MessageService],
})
export class ClientHistoryComponent implements OnInit {
  bookingHistory: Booking[] = [];
  isLoading = true;
  isResumingPayment = false;
  resumingBookingId: string | null = null;

  constructor(
    private historyService: HistoryService,
    private bookingService: BookingService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.historyService.getHistory().subscribe({
      next: (data) => {
        this.bookingHistory = data;
        this.isLoading = false;
        console.log('Client history:', data);
      },
      error: (error) => {
        console.error('Error fetching client history:', error);
        this.isLoading = false;
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  canRefund(booking: Booking): boolean {
    const now = new Date();
    const startDate = new Date(booking.startDate);
    const eligibleStatuses = ['paid', 'confirmed'];
    return (
      eligibleStatuses.includes(booking.status.toLowerCase()) && startDate > now
    );
  }

  canResumePayment(booking: Booking): boolean {
    const eligibleStatuses = ['pending', 'failed', 'incomplete'];
    return eligibleStatuses.includes(booking.status.toLowerCase());
  }

  refundBooking(bookingId: string): void {
    this.bookingService.refundBooking(bookingId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Refund Requested',
          detail: `Your refund request has been submitted successfully, Amount of refund :${response.refundAmount} `,
        });
        this.loadHistory();
      },
      error: (error) => {
        console.error('Error processing refund:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Refund Failed',
          detail: 'Failed to process refund request. Please try again later.',
        });
      },
    });
  }

  resumePayment(bookingId: string): void {
    this.isResumingPayment = true;
    this.resumingBookingId = bookingId;

    this.bookingService.resumePayment(bookingId).subscribe({
      next: (response) => {
        this.isResumingPayment = false;
        this.resumingBookingId = null;

        this.messageService.add({
          severity: 'info',
          summary: 'Redirecting to Payment',
          detail: 'Redirecting you to complete your payment...',
        });

        setTimeout(() => {
          window.location.href = response.iframeUrl;
        }, 1500);
      },
      error: (error) => {
        this.isResumingPayment = false;
        this.resumingBookingId = null;

        console.error('Error resuming payment:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Resume Payment Failed',
          detail:
            error.error?.message ||
            'Failed to resume payment. Please try again.',
        });
      },
    });
  }
}
