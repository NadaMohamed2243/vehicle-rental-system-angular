import { Component, input, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Cars } from '../../../../core/interfaces/cars';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { Observable, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-card',
  imports: [StarRatingComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',,
})
export class CardComponent implements OnInit, OnDestroy {
  carDetails = input<Cars>();;
  fromWho = input<'landing' | 'home' | 'car' | 'wishlist'>();;
  isFavorite = false;
  private _carService = inject(CarService);
  private _wishlistService = inject(WishlistService);
  private _wishlistSubscription?: Subscription;
  private _wishlist: Cars[] = [];

  ngOnInit(): void {
    this.loadWishlist();
  }

  ngOnDestroy(): void {
    this._wishlistSubscription?.unsubscribe();
  }

  loadWishlist(): void {
    this._wishlistSubscription = this._wishlistService.getWishlist().subscribe({
      next: (wishlist) => {
        this._wishlist = wishlist;
        this.isFavorite = this.isInWishlist();
      },
      error: (error) => {
        console.error('Error fetching wishlist:', error);
      },
    });
  }

  isInWishlist(): boolean {
    return this._wishlist.some(
      (wishlistCar) => wishlistCar._id === this.carDetails()?._id
    );
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
  getTargetRoute() {
    const source = this.fromWho();
    const car = this.carDetails()!;
    this._carService.setSelectedCar(car);
    // return source === 'home' ? '/cars' : '/cars' ;
  }
}
