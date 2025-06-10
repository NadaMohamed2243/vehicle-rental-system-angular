export interface Client {
    id: number;
    name: string;
    email: string;
    location: Location
    status: 'pending' | 'approved';
    license: string;
}

export interface Location {
  city: string
}
