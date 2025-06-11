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
  documents?: string[];
  is_approved?: boolean;
  with_driver?: boolean;
  carPhotos: string[]
  agent: Agent
  createdAt: string
  updatedAt: string
  __v: number
}



export interface Agent {
  _id: string
  user_id: string
  company_name: string
  phone_number: string
  location: string
  ID_document: string
  verification_status: string
  lat: number
  lng: number
  opening_hours: string
  permissions: string[]
  __v: number
}
