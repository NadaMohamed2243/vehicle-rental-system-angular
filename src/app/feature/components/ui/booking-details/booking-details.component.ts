import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DividerModule } from 'primeng/divider';
import { Cars } from '../../../../core/interfaces/cars';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    ToggleSwitchModule,
    DividerModule,
  ],
  template: `
    <div class="card flex py-5">
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <p class="text-xs font-bold">PICK-UP DATE & TIME</p>
          <p-datepicker
            [iconDisplay]="'input'"
            [showIcon]="true"
            inputId="pickupDate"
            [showTime]="true"
            [(ngModel)]="pickupDate"
            [minDate]="minDate"
            (ngModelChange)="onPickupDateChange()"
            [showButtonBar]="true"
            placeholder="Select pickup date & time"
          />
          @if (pickupDate && pickupDate < minDate) {
          <small class="text-red-500 text-xs"
            >Pickup date cannot be in the past</small
          >
          }
        </div>

        <div class="flex flex-col gap-2">
          <p class="text-xs font-bold">DROP-OFF DATE & TIME</p>
          <p-datepicker
            [iconDisplay]="'input'"
            [showIcon]="true"
            inputId="dropoffDate"
            [showTime]="true"
            [(ngModel)]="dropoffDate"
            [minDate]="minDropoffDate"
            (ngModelChange)="onDropoffDateChange()"
            [showButtonBar]="true"
            placeholder="Select drop-off date & time"
          />
          @if (dropoffDate && pickupDate && dropoffDate <= pickupDate) {
          <small class="text-red-500 text-xs"
            >Drop-off date must be after pickup date</small
          >
          }
        </div>

        @if (selectedCar?.with_driver) {
        <div class="mt-6 mb-3 flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-xs font-bold">WITH DRIVER</span>
            <span class="text-xs text-gray-500"
              >Required for delivery service</span
            >
          </div>
          <p-toggleswitch
            [(ngModel)]="withDriver"
            (ngModelChange)="onWithDriverChange($event)"
          />
        </div>
        }
      </div>

      <p-divider layout="vertical" />

      <div class="flex flex-col gap-2 w-50">
        <div class="flex justify-between items-center">
          <p class="text-xs font-bold">CAR RENTAL</p>
          <p class="text-sm font-semibold">
            EG
            {{
              (selectedCar?.totalPricePerHour || 0) * rentalDuration
                | number : '1.2-2'
            }}
          </p>
        </div>

        @if (withDriver) {
        <div class="flex justify-between items-center">
          <p class="text-xs font-bold">DRIVER FEE</p>
          <p class="text-sm font-semibold">
            EG {{ 25 * rentalDuration | number : '1.2-2' }}
          </p>
        </div>
        }

        <div class="flex justify-between items-center my-4">
          <p class="text-xs font-bold">SALES TAXES</p>
          <p class="text-sm font-semibold">$13.06</p>
        </div>

        <div class="flex justify-between items-center">
          <p class="text-lg font-bold">Total Price</p>
          <p class="text-lg font-semibold">
            EG {{ totalPrice | number : '1.2-2' }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class BookingDetailsComponent {
  @Input() selectedCar: Cars | null = null;
  @Input() pickupDate: Date | null = null;
  @Input() dropoffDate: Date | null = null;
  @Input() withDriver: boolean = false;
  @Input() minDate: Date = new Date();
  @Input() minDropoffDate: Date = new Date();
  @Input() rentalDuration: number = 0;
  @Input() totalPrice: number = 0;

  @Output() pickupDateChange = new EventEmitter<Date | null>();
  @Output() dropoffDateChange = new EventEmitter<Date | null>();
  @Output() withDriverChange = new EventEmitter<boolean>();
  @Output() pickupDateValidation = new EventEmitter<void>();
  @Output() dropoffDateValidation = new EventEmitter<void>();

  onPickupDateChange() {
    this.pickupDateChange.emit(this.pickupDate);
    this.pickupDateValidation.emit();
  }

  onDropoffDateChange() {
    this.dropoffDateChange.emit(this.dropoffDate);
    this.dropoffDateValidation.emit();
  }

  onWithDriverChange(value: boolean) {
    this.withDriverChange.emit(value);
  }
}
