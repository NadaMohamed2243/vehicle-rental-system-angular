import { Component, input, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Cars } from '../../../../core/interfaces/cars';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable, map, Subscription } from 'rxjs';
import { CarService } from '../../../../core/services/car.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-card',
  imports: [StarRatingComponent,TranslateModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit, OnDestroy {
  carDetails = input<Cars>();
  fromWho = input<'landing' | 'home' | 'car' | 'wishlist'>();
  isFavorite = false;
  private _wishlistSubscription?: Subscription;
  private _wishlist: Cars[] = [];

  constructor(
    private _carService: CarService,
    private _wishlistService: WishlistService,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this._authService.isAuthenticated()) {
      this.loadWishlist();
    }
  }

  ngOnDestroy(): void {
    this._wishlistSubscription?.unsubscribe();
  }

  loadWishlist(): void {
    if (!this._authService.isAuthenticated()) {
      return;
    }

    this._wishlistSubscription = this._wishlistService.getWishlist().subscribe({
      next: (wishlist) => {
        this._wishlist = wishlist;
        this.isFavorite = this.isInWishlist();
      },
      error: (error) => {
        console.error('Error fetching wishlist:', error);
        this._wishlist = [];
        this.isFavorite = false;
      },
    });
  }

  isInWishlist(): boolean {
    return this._wishlist.some(
      (wishlistCar) => wishlistCar._id === this.carDetails()?._id
    );
  }

  toggleFavorite() {
    if (!this._authService.isAuthenticated()) {
      console.log('Please log in to add items to wishlist');
      return;
    }

    this.isFavorite = !this.isFavorite;
    const carId = this.carDetails()?._id;

    if (!carId) return;

    if (this.isFavorite) {
      this._wishlistService.addToWishlist(carId).subscribe({
        next: (response) => {
          console.log('Car added to wishlist:', response);
        },
        error: (error) => {
          console.error('Error adding car to wishlist:', error);
          this.isFavorite = false;
        },
      });
    } else {
      this._wishlistService.removeFromWishlist(carId).subscribe({
        next: (response) => {
          console.log('Car removed from wishlist:', response);
        },
        error: (error) => {
          console.error('Error removing car from wishlist:', error);
          this.isFavorite = true;
        },
      });
    }
  }

  getTargetRoute() {
    const source = this.fromWho();
    const car = this.carDetails()!;
    this._carService.setSelectedCar(car);
  }
}
