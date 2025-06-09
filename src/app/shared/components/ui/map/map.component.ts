import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var L: any;

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <div id="map" class="w-full h-[250px] rounded-lg"></div>
    <div class="mt-2 text-sm text-gray-600">
      @if (distance) {
      <p>Distance to car: {{ distance }} km</p>
      } @if (selectedDeliveryLocation) {
      <p>
        Delivery location:
        {{ selectedDeliveryLocation.address || 'Selected location' }}
      </p>
      }
    </div>
  `,
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() carLocation!: Location | undefined;
  @Input() userLocation?: Location | null;
  @Input() enableDeliverySelection: boolean = true;
  @Output() deliveryLocationSelected = new EventEmitter<Location>();

  private map: any;
  private carMarker: any;
  private userMarker: any;
  private deliveryMarker: any;

  distance: string = '';
  selectedDeliveryLocation: Location | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLeaflet();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private loadLeaflet() {
    if (typeof L !== 'undefined') {
      this.initializeMap();
      return;
    }

    // Load Leaflet CSS
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCSS);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeMap();
    document.head.appendChild(script);
  }

  private initializeMap() {
    // Initialize map centered on car location
    this.map = L.map('map').setView(
      [this.carLocation?.lat, this.carLocation?.lng],
      13
    );

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.addCarMarker();
    this.addUserMarker();
    this.setupMapClickListener();
    this.calculateDistance();
  }

  private addCarMarker() {
    // Car icon
    const carIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3774/3774278.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    this.carMarker = L.marker([this.carLocation?.lat, this.carLocation?.lng], {
      icon: carIcon,
    })
      .addTo(this.map)
      .bindPopup('Car Location')
      .openPopup();
  }

  private addUserMarker() {
    if (this.userLocation) {
      this.createUserMarker();
    } else {
      this.getCurrentLocation();
    }
  }

  private createUserMarker() {
    if (!this.userLocation) return;

    // User icon
    const userIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });

    this.userMarker = L.marker([this.userLocation.lat, this.userLocation.lng], {
      icon: userIcon,
    })
      .addTo(this.map)
      .bindPopup('Your Location');

    // Fit map to show both markers
    const group = new L.featureGroup([this.carMarker, this.userMarker]);
    this.map.fitBounds(group.getBounds().pad(0.1));
  }

  private getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.createUserMarker();
          this.calculateDistance();
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }

  private setupMapClickListener() {
    if (this.enableDeliverySelection) {
      this.map.on('click', (e: any) => {
        const location: Location = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };
        this.setDeliveryLocation(location);
      });
    }
  }

  private setDeliveryLocation(location: Location) {
    // Remove existing delivery marker
    if (this.deliveryMarker) {
      this.map.removeLayer(this.deliveryMarker);
    }

    // Delivery icon
    const deliveryIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [35, 35],
      iconAnchor: [17, 35],
      popupAnchor: [0, -35],
    });

    this.deliveryMarker = L.marker([location.lat, location.lng], {
      icon: deliveryIcon,
    })
      .addTo(this.map)
      .bindPopup('Delivery Location')
      .openPopup();

    this.selectedDeliveryLocation = location;
    this.deliveryLocationSelected.emit(location);
    this.getAddressFromCoordinates(location);
  }

  private getAddressFromCoordinates(location: Location) {
    // Using Nominatim (free geocoding service)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.display_name) {
          this.selectedDeliveryLocation!.address = data.display_name;
        }
      })
      .catch((error) => {
        console.error('Error getting address:', error);
      });
  }

  private calculateDistance() {
    if (this.userLocation && this.carLocation) {
      const userLatLng = L.latLng(this.userLocation.lat, this.userLocation.lng);
      const carLatLng = L.latLng(this.carLocation.lat, this.carLocation.lng);
      const distance = userLatLng.distanceTo(carLatLng);
      this.distance = (distance / 1000).toFixed(2);
    }
  }
}
