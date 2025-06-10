// export interface agent {
//     id: number;
//     name: string;
//     email: string;
//     location: Location
//     status: 'pending' | 'approved';
//     phone: string;
//     carsNumber: number;
// }

// export interface Location {
//   city: string
// }


export interface Agent {
  _id: string;
  user_id: string;
  company_name: string;
  phone_number: string;
  location: string;
  ID_document: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  lat: number;
  lng: number;
  opening_hours: string;
  permissions: string[];
  __v?: number;
}


