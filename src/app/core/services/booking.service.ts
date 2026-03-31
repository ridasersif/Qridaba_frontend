import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BookingRequest, BookingResponse } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bookings`;

  createBooking(request: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.apiUrl, request);
  }

  getUnavailableDates(itemId: string): Observable<string[][]> {
    return this.http.get<string[][]>(`${this.apiUrl}/item/${itemId}/unavailable-dates`);
  }

  updateBookingStatus(bookingId: string, status: string): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${bookingId}/status`, null, {
      params: { status }
    });
  }

  getOwnerBookings(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.apiUrl}/owner`);
  }
}
