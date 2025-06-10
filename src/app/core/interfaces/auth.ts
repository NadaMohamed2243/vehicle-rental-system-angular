export interface ClientRegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location: string;
  driver_license: File;
  lat: number;
  lng: number;
}

export interface RegisterAgentData {
  email: string;
  password: string;
  phone_number: string;
  location: string;
  company_name: string;
  opening_hours: string;
  lat: string;
  lng: string;
}

export interface LoginData {
  email: string;
  password: string;
}
// Response types 
export interface AuthResponse {
  token: string;
  user: {
      id: string;
      email: string;
      role: string;
      name?: string;
      profileId?: string;
      verified?: boolean;
    }
  }
