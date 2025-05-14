export interface Client {
    id: number;
    name: string;
    email: string;
    location: Location
    status: 'pending' | 'approved';
}

export interface Location {
  city: string
}
