import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var L: any;

export interface Location {
  lat: number | undefined;
  lng: number | undefined;
  address?: string | null;
}

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <div #mapContainer [id]="mapId" class="w-full h-[250px] rounded-lg"></div>
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
export class MapComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() carLocation!: Location | null;
  @Input() userLocation?: Location | null;
  @Input() enableDeliverySelection: boolean = true;
  @Output() deliveryLocationSelected = new EventEmitter<Location>();

  @ViewChild('mapContainer', { static: false })
  mapContainerRef!: ElementRef<HTMLDivElement>;

  mapId = 'map-' + Math.random().toString(36).substring(2, 10);
  private map: any;
  private carMarker: any;
  private userMarker: any;
  private deliveryMarker: any;

  distance: string = '';
  selectedDeliveryLocation: Location | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Do nothing here
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.loadLeaflet(), 0);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['carLocation'] && !changes['carLocation'].firstChange) {
      this.destroyMap();
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.loadLeaflet(), 0);
      }
    }
  }

  ngOnDestroy() {
    this.destroyMap();
  }

  private destroyMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    // Remove map container content to ensure a clean slate
    if (this.mapContainerRef?.nativeElement) {
      this.mapContainerRef.nativeElement.innerHTML = '';
    }
  }

  private loadLeaflet() {
    // Wait for the map container to exist in the DOM
    if (!this.mapContainerRef?.nativeElement) {
      setTimeout(() => this.loadLeaflet(), 50);
      return;
    }
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
    if (
      !this.carLocation ||
      this.carLocation.lat == null ||
      this.carLocation.lng == null
    )
      return;
    const mapElement = this.mapContainerRef?.nativeElement;
    if (!mapElement) return;

    // Defensive: Remove any previous map instance from this container
    mapElement.innerHTML = '';

    this.map = L.map(this.mapId).setView(
      [this.carLocation.lat, this.carLocation.lng],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.addCarMarker();
    this.addUserMarker();
    this.setupMapClickListener();
    this.calculateDistance();
  }

  private addCarMarker() {
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
    if (this.deliveryMarker) {
      this.map.removeLayer(this.deliveryMarker);
    }

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
