import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../../core/services/booking.service';
import { BookingResponse, BookingStatus } from '../../../../core/models/booking.model';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings-list.component.html',
  styleUrl: './bookings-list.component.scss'
})
export class BookingsListComponent implements OnInit {
  private bookingService = inject(BookingService);

  bookings: BookingResponse[] = [];
  loading = true;
  error: string | null = null;
  actionLoadingId: string | null = null;

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getOwnerBookings().subscribe({
      next: (res: any) => {
        // Handle array or ApiResponse wrapping
        this.bookings = res.data || res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings', err);
        this.error = 'Could not load your incoming bookings';
        this.loading = false;
      }
    });
  }

  updateStatus(bookingId: string, status: string) {
    this.actionLoadingId = bookingId;
    this.bookingService.updateBookingStatus(bookingId, status).subscribe({
      next: (res: any) => {
        const updated = res.data || res;
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
          this.bookings[index] = updated;
        }
        this.actionLoadingId = null;
      },
      error: (err) => {
        console.error('Update failed', err);
        this.actionLoadingId = null;
      }
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
