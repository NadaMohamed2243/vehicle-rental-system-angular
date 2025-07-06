import { Component, OnInit, inject } from '@angular/core';
import { LayoutComponent } from '../../../core/pages/layout/layout.component';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { Cars } from '../../../core/interfaces/cars';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-wishlist',
  standalone: true,
  imports: [LayoutComponent, CardComponent, CommonModule],
  templateUrl: './client-wishlist.component.html',
  styleUrl: './client-wishlist.component.css',
})
export class ClientWishlistComponent implements OnInit {
  wishlist: Cars[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  private _wishlistService = inject(WishlistService);
  private _authService = inject(AuthService);

  ngOnInit(): void {
    if (this._authService.isAuthenticated()) {
      this.loadWishlist();
    } else {
      this.isLoading = false;
      this.errorMessage = 'Please log in to view your wishlist';
    }
  }

  private loadWishlist(): void {
    this._wishlistService.getWishlist().subscribe({
      next: (data) => {
        this.wishlist = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching wishlist:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load wishlist. Please try again.';
      },
    });
  }
}
