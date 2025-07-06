import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../core/pages/layout/layout.component';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Car } from '../../../core/interfaces/car';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { Cars } from '../../../core/interfaces/cars';

@Component({
  selector: 'app-client-wishlist',
  imports: [LayoutComponent, CardComponent],
  templateUrl: './client-wishlist.component.html',
  styleUrl: './client-wishlist.component.css',
})
export class ClientWishlistComponent implements OnInit {
  wishlist: Cars[] = [];
  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.getWishlist().subscribe({
      next: (data) => {
        this.wishlist = data;
      },
      error: (error) => {
        console.error('Error fetching wishlist:', error);
      },
    });
  }
}
