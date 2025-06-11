

export interface Agent {
  _id: string;
  user_id: string;
  company_name: string;
  phone_number: string;
  location: string;
  ID_document: string;
  verification_status: 'pending' | 'approved' | 'rejected'| 'banned';
  lat: number;
  lng: number;
  opening_hours: string;
  permissions: string[];
  __v?: number;
}


