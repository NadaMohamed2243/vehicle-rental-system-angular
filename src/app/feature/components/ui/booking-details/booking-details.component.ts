import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DividerModule } from 'primeng/divider';
import { Cars } from '../../../../core/interfaces/cars';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    ToggleSwitchModule,
    DividerModule,
    TranslateModule
  ],
  template: `
    <div class="card flex py-5">
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <p class="text-xs font-bold">{{ 'BOOKING_DETAILS.PICKUP_TITLE' | translate }}</p>
          <p-datepicker
            [iconDisplay]="'input'"
            [showIcon]="true"
            inputId="pickupDate"
            [showTime]="true"
            [(ngModel)]="pickupDate"
            [minDate]="minDate"
            (ngModelChange)="onPickupDateChange()"
            [showButtonBar]="true"
            [placeholder]="'BOOKING_DETAILS.PICKUP_PLACEHOLDER' | translate"
          />
          @if (pickupDate && pickupDate < minDate) {
          <small class="text-red-500 text-xs">
        {{ 'BOOKING_DETAILS.PICKUP_ERROR' | translate }}
            </small>
          }
        </div>

        <div class="flex flex-col gap-2">
          <p class="text-xs font-bold">{{ 'BOOKING_DETAILS.DROPOFF_TITLE' | translate }}</p>
          <p-datepicker
            [iconDisplay]="'input'"
            [showIcon]="true"
            inputId="dropoffDate"
            [showTime]="true"
            [(ngModel)]="dropoffDate"
            [minDate]="minDropoffDate"
            (ngModelChange)="onDropoffDateChange()"
            [showButtonBar]="true"
            [placeholder]="'BOOKING_DETAILS.DROPOFF_PLACEHOLDER' | translate"
          />
          @if (dropoffDate && pickupDate && dropoffDate <= pickupDate) {
          <small class="text-red-500 text-xs">
        {{ 'BOOKING_DETAILS.DROPOFF_ERROR' | translate }}
            </small
          >
          }
        </div>

        @if (selectedCar?.with_driver) {
        <div class="mt-6 mb-3 flex justify-between items-center">
          <div class="flex flex-col">
          <span class="text-xs font-bold">{{ 'BOOKING_DETAILS.WITH_DRIVER_TITLE' | translate }}</span>
        <span class="text-xs text-gray-500">
          {{ 'BOOKING_DETAILS.WITH_DRIVER_NOTE' | translate }}
        </span>
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
          <p class="text-xs font-bold">{{ 'BOOKING_DETAILS.CAR_RENTAL' | translate }}</p>
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
          <p class="text-xs font-bold">{{ 'BOOKING_DETAILS.DRIVER_FEE' | translate }}</p>
          <p class="text-sm font-semibold">
            EG {{ 25 * rentalDuration | number : '1.2-2' }}
          </p>
        </div>
        }

        <div class="flex justify-between items-center my-4">
          <p class="text-xs font-bold">{{ 'BOOKING_DETAILS.SALES_TAXES' | translate }}</p>
          <p class="text-sm font-semibold">$13.06</p>
        </div>

        <div class="flex justify-between items-center">
          <p class="text-lg font-bold">{{ 'BOOKING_DETAILS.TOTAL_PRICE' | translate }}</p>
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
