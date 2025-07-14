import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-3">
      @if (isLoadingBookingHistory) {
      <div class="flex justify-center items-center py-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007efc]"
        ></div>
      </div>
      } @if (!isLoadingBookingHistory && carBookingHistory.length === 0) {
      <div class="text-center py-8">
        <i class="pi pi-calendar text-gray-400 text-4xl mb-2"></i>
        <p class="text-gray-500">No booking history available for this car</p>
      </div>
      } @if (!isLoadingBookingHistory && carBookingHistory.length > 0) {
      <div class="space-y-3 max-h-[300px] overflow-y-auto">
        @for (booking of carBookingHistory; track booking._id) {
        <div
          class="border rounded-lg p-3"
          [class.border-blue-200]="isFutureBooking(booking.startDate)"
          [class.bg-blue-50]="isFutureBooking(booking.startDate)"
          [class.border-gray-200]="!isFutureBooking(booking.startDate)"
          [class.bg-gray-50]="!isFutureBooking(booking.startDate)"
        >
          <div class="flex justify-between items-start mb-2">
            <span
              class="text-xs font-semibold"
              [class.text-blue-700]="isFutureBooking(booking.startDate)"
              [class.text-gray-700]="!isFutureBooking(booking.startDate)"
            >
              Booking #{{ booking._id.slice(-6) }}
            </span>
            <span
              class="text-xs px-2 py-1 rounded-full font-medium"
              [class.bg-blue-100]="isFutureBooking(booking.startDate)"
              [class.text-blue-800]="isFutureBooking(booking.startDate)"
              [class.bg-gray-100]="!isFutureBooking(booking.startDate)"
              [class.text-gray-800]="!isFutureBooking(booking.startDate)"
            >
              {{ isFutureBooking(booking.startDate) ? 'Upcoming' : 'Past' }}
            </span>
          </div>

          <div class="space-y-1 text-xs">
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar text-green-500"></i>
              <span class="text-gray-600">Start:</span>
              <span class="font-medium">{{
                formatBookingDate(booking.startDate)
              }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar text-red-500"></i>
              <span class="text-gray-600">End:</span>
              <span class="font-medium">{{
                formatBookingDate(booking.endDate)
              }}</span>
            </div>
          </div>
        </div>
        }
      </div>
      }
    </div>
  `,
})
export class BookingHistoryComponent {
  @Input() carBookingHistory: any[] = [];
  @Input() isLoadingBookingHistory: boolean = false;

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
}
