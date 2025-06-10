//the new interface for cars (called cars with s) only to avoid conflict and errors
export interface Cars {
  _id: string
  brand: string
  model: string
  type: string
  year: number
  licensePlate: string
  transmission: string
  fuel_type: string
  seats: number
  color: string
  rentalRatePerDay: number
  rentalRatePerHour: number
  availabilityStatus: string
  rating: number
  depositRequired: number
  insuranceStatus: string
  lastMaintenanceDate: string
  nextMaintenanceDue: string
  conditionNotes: string
  fuelLevel: string
  odometerReading: number
  lastRentedDate: string
  expectedReturnDate: string
  totalPricePerHour: number
  totalPricePerDay: number
  carPhotos: string[]
  agent: string
  createdAt: string
  updatedAt: string
  __v: number
}
