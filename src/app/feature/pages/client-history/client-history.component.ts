import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../core/pages/layout/layout.component';
import { HistoryService } from '../../../core/services/history.service';
import { Booking } from '../../../core/services/history.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-history',
  standalone: true,
  imports: [LayoutComponent, CommonModule],
  templateUrl: './client-history.component.html',
  styleUrl: './client-history.component.css',
})
export class ClientHistoryComponent implements OnInit {
  bookingHistory: Booking[] = [];
  isLoading = true;

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.historyService.getHistory().subscribe({
      next: (data) => {
        this.bookingHistory = data;
        this.isLoading = false;
        console.log('Client history:', data);
      },
      error: (error) => {
        console.error('Error fetching client history:', error);
        this.isLoading = false;
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
