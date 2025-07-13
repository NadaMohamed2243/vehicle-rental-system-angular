import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cars } from '../../../../core/interfaces/cars';

@Component({
  selector: 'app-booking-action',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="w-full h-[80px] bg-light-blue flex justify-between items-center rounded-lg"
    >
      <div class="ps-5">
        <p class="text-xs text-white font-semibold">BOOK VEHICLE</p>
        <p class="text-sm text-white font-semibold">
          {{ selectedCar?.brand }} {{ selectedCar?.model }}
        </p>
      </div>
      <div>
        <p class="text-xs text-white font-semibold">FREE BOOKING</p>
        <p class="text-sm text-white font-semibold">10 minutes</p>
      </div>
      <div class="h-full">
        <button
          class="bg-[#3e9efb] h-full w-[80px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="isBookingDisabled()"
          (click)="bookVehicle.emit()"
        >
          @if (isBooking) {
          <i class="pi pi-spinner pi-spin" style="color: white"></i>
          } @else {
          <i class="pi pi-angle-right" style="color: white"></i>
          }
        </button>
      </div>
    </div>
  `,
})
export class BookingActionComponent {
  @Input() selectedCar: Cars | null = null;
  @Input() isBooking: boolean = false;
  @Input() pickupDate: Date | null = null;
  @Input() dropoffDate: Date | null = null;
  @Input() isValidDateRange: boolean = false;

  @Output() bookVehicle = new EventEmitter<void>();

  isBookingDisabled(): boolean {
    if (this.isBooking) return true;
    if (!this.pickupDate || !this.dropoffDate) return true;

    const now = new Date();

    // Check if pickup date/time is in the future
    if (this.pickupDate <= now) return true;

    // Check if dropoff is at least 1 hour after pickup (allows same day)
    const minimumDropoffTime = new Date(
      this.pickupDate.getTime() + 60 * 60 * 1000
    );
    if (this.dropoffDate < minimumDropoffTime) return true;

    // Use the isValidDateRange if provided, otherwise use our logic
    return !this.isValidDateRange;
  }
}
