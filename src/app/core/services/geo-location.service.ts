import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

interface IPInfo {
  city: string;
  region: string;
  country: string;
  ip: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class GeoLocationService {
  constructor(private http: HttpClient) {}

  private locations = [
    { label: 'Cairo', value: 'cairo' },
    { label: 'Giza', value: 'giza' },
    { label: 'Alexandria', value: 'alexandria' },
    { label: 'Port Said', value: 'port_said' },
    { label: 'Suez', value: 'suez' },
    { label: 'Mansoura', value: 'mansoura' },
    { label: 'Tanta', value: 'tanta' },
    { label: 'Zagazig', value: 'zagazig' },
    { label: 'Ismailia', value: 'ismailia' },
    { label: 'Fayoum', value: 'fayoum' },
    { label: 'Beni Suef', value: 'beni_suef' },
    { label: 'Minya', value: 'minya' },
    { label: 'Asyut', value: 'asyut' },
    { label: 'Sohag', value: 'sohag' },
    { label: 'Qena', value: 'qena' },
    { label: 'Luxor', value: 'luxor' },
    { label: 'Aswan', value: 'aswan' },
    { label: 'Hurghada', value: 'hurghada' },
    { label: 'Sharm El Sheikh', value: 'sharm_el_sheikh' },
    { label: 'Damanhur', value: 'damanhur' },
    { label: 'Damietta', value: 'damietta' },
    { label: 'El Arish', value: 'el_arish' },
    { label: 'Banha', value: 'banha' },
    { label: 'Kafr El Sheikh', value: 'kafr_el_sheikh' },
    { label: 'Mahalla', value: 'mahalla' },
    { label: 'Qalyub', value: 'qalyub' },
    { label: '6th of October', value: 'sixth_october' },
    { label: 'New Cairo', value: 'new_cairo' },
    { label: 'Obour', value: 'obour' },
    { label: '10th of Ramadan', value: 'tenth_of_ramadan' },
    { label: 'Badr', value: 'badr' },
  ];

  public mapCityToLocation(city: string): string | undefined {
    if (!city) return undefined;

    // Normalize the input more aggressively
    const normalizedInput = city
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/^(al|el)\s+/, ''); // Remove common Arabic prefixes

    // Special cases first
    if (
      normalizedInput.includes('mansoura') ||
      normalizedInput.includes('mansura') ||
      normalizedInput.includes('mansurah') ||
      normalizedInput.includes('dakahlia')
    ) {
      // Dakahlia is the governorate
      return 'mansoura';
    }

    // Try exact match
    const exactMatch = this.locations.find(
      (loc) => loc.label.toLowerCase() === normalizedInput
    );
    if (exactMatch) return exactMatch.value;

    // Try partial match
    const partialMatch = this.locations.find((loc) => {
      const locName = loc.label.toLowerCase();
      return (
        normalizedInput.includes(locName) || locName.includes(normalizedInput)
      );
    });

    return partialMatch?.value;
  }

  getLocation(): Observable<IPInfo> {
    const saved = localStorage.getItem('user_city');
    const savedLocation = localStorage.getItem('user_location');

    if (saved && savedLocation) {
      const parsedLocation = JSON.parse(savedLocation);
      return of({
        city: saved,
        latitude: parsedLocation.lat,
        longitude: parsedLocation.lng,
      } as IPInfo);
    }

    return this.http.get<IPInfo>('https://ipapi.co/json/').pipe(
      tap((res) => {
        const mappedCity = this.mapCityToLocation(res.city);
        if (mappedCity) {
          res.city = mappedCity;
          localStorage.setItem('user_city', mappedCity);
        } else {
          // Fallback to original city if no mapping found
          localStorage.setItem('user_city', res.city);
        }
        localStorage.setItem(
          'user_location',
          JSON.stringify({ lat: res.latitude, lng: res.longitude })
        );
      })
    );
  }
}
