
export interface Client {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location: string;
  lat: number;
  lng: number;
  driver_license: string;
  verification_status: 'pending' | 'approved' | 'rejected'; 
}