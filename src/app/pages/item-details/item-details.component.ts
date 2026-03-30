import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemService } from '../../core/services/item.service';
import { BookingService } from '../../core/services/booking.service';
import { Item } from '../../core/models/item.model';
import { BookingRequest } from '../../core/models/booking.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isDisabled: boolean;
  isSelectedStart: boolean;
  isSelectedEnd: boolean;
  isInRange: boolean;
}

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.scss'
})
export class ItemDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private itemService = inject(ItemService);
  private bookingService = inject(BookingService);

  item: Item | null = null;
  loading = true;
  bookingLoading = false;
  error: string | null = null;
  bookingSuccess: boolean = false;

  // Calendar State
  currentDate = new Date();
  calendarDays: CalendarDay[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  startDate: Date | null = null;
  endDate: Date | null = null;
  unavailableDates: Date[] = [];
  hoveredDate: Date | null = null;

  // Price calculations
  totalDays = 0;
  basePrice = 0;
  bookingFee = 0;
  totalPrice = 0;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadItemDetails(id);
        this.loadUnavailableDates(id);
      }
    });
    this.generateCalendar();
  }

  loadItemDetails(id: string) {
    this.loading = true;
    this.itemService.getItemById(id).subscribe({
      next: (res) => {
        this.item = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load item', err);
        this.error = 'Failed to load item details.';
        this.loading = false;
      }
    });
  }

  loadUnavailableDates(id: string) {
    this.bookingService.getUnavailableDates(id).subscribe({
      next: (datesArrStr: any) => {
        this.unavailableDates = [];
        // Extract and flatten string arrays into Dates
        if (Array.isArray(datesArrStr)) {
          datesArrStr.forEach(range => {
            if (Array.isArray(range) && range.length >= 2) {
              const start = new Date(range[0]);
              const end = new Date(range[1]);
              // Push all days from start to end
              for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                this.unavailableDates.push(new Date(d));
              }
            }
          });
        }
        this.generateCalendar();
      },
      error: (err) => {
        console.error('Failed to load unavailabe dates', err);
      }
    });
  }

  // --- Calendar Logic ---

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDay.getDay(); 
    
    this.calendarDays = [];

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      this.calendarDays.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        isDisabled: true, // we don't allow selecting past month usually, or simply keep generic state
        isSelectedStart: false,
        isSelectedEnd: false,
        isInRange: false
      });
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const iterDate = new Date(year, month, i);
      iterDate.setHours(0,0,0,0);
      
      const isPast = iterDate < today;
      const isUnavailable = this.isDateUnavailable(iterDate);
      
      let isDisabled = isPast || isUnavailable;

      // Also disable if they clicked startDate, and this is BEFORE startDate
      if (this.startDate && !this.endDate && iterDate < this.startDate) {
        isDisabled = true;
      }
      // Also disable if this date is valid, but there's a booked date BETWEEN startDate and this date
      if (this.startDate && !this.endDate && !isDisabled && iterDate > this.startDate) {
        if (this.hasUnavailableDateInRange(this.startDate, iterDate)) {
          isDisabled = true;
        }
      }

      this.calendarDays.push({
        date: iterDate,
        isCurrentMonth: true,
        isDisabled: isDisabled,
        isSelectedStart: this.isSameDate(this.startDate, iterDate),
        isSelectedEnd: this.isSameDate(this.endDate, iterDate),
        isInRange: this.isDateInRange(iterDate)
      });
    }

    // Next month padding to fill grid
    const remainingSlots = 42 - this.calendarDays.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingSlots; i++) {
        this.calendarDays.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isDisabled: true,
        isSelectedStart: false,
        isSelectedEnd: false,
        isInRange: false
      });
    }
  }

  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }

  selectDate(day: CalendarDay) {
    if (day.isDisabled) return;

    if (!this.startDate || (this.startDate && this.endDate)) {
      // Start a new range
      this.startDate = day.date;
      this.endDate = null;
    } else if (this.startDate && !this.endDate) {
      if (day.date < this.startDate) {
        this.startDate = day.date;
      } else {
        this.endDate = day.date;
      }
    }

    this.calculatePrice();
    this.generateCalendar(); // Re-render to update selected classes
  }

  clearDates() {
    this.startDate = null;
    this.endDate = null;
    this.calculatePrice();
    this.generateCalendar();
  }

  isDateUnavailable(date: Date): boolean {
    return this.unavailableDates.some(unavailableDate => this.isSameDate(date, unavailableDate));
  }

  hasUnavailableDateInRange(start: Date, end: Date): boolean {
    let current = new Date(start);
    while (current <= end) {
      if (this.isDateUnavailable(current)) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  }

  isSameDate(d1: Date | null, d2: Date | null): boolean {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  isDateInRange(date: Date): boolean {
    if (!this.startDate || !this.endDate) return false;
    return date > this.startDate && date < this.endDate;
  }

  get currentMonthYearString(): string {
    return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  // --- Price Logic ---

  calculatePrice() {
    if (!this.item) return;

    if (this.startDate && this.endDate) {
      const timeDiff = Math.abs(this.endDate.getTime() - this.startDate.getTime());
      // +1 to include both start and end days
      this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; 

      this.basePrice = this.totalDays * this.item.pricePerDay;
      this.bookingFee = Math.round(this.basePrice * 0.10); // 10% fee
      this.totalPrice = this.basePrice + this.bookingFee;
    } else if (this.startDate && !this.endDate) {
       this.totalDays = 1;
       this.basePrice = this.item.pricePerDay;
       this.bookingFee = Math.round(this.basePrice * 0.10);
       this.totalPrice = this.basePrice + this.bookingFee;
    } else {
      this.totalDays = 0;
      this.basePrice = 0;
      this.bookingFee = 0;
      this.totalPrice = 0;
    }
  }

  // --- Booking Submission ---

  sendRequest() {
    if (!this.startDate || !this.endDate || !this.item) return;

    const token = localStorage.getItem('token');
    if (!token) {
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
        return;
    }

    this.bookingLoading = true;
    
    // Convert Dates to ISO string format keeping local time component to avoid zone shift
    // simple YYYY-MM-DDTHH:mm:ss for backend
    const pad = (n: number) => n < 10 ? '0'+n : n;
    const sDate = this.startDate;
    const startStr = `${sDate.getFullYear()}-${pad(sDate.getMonth() + 1)}-${pad(sDate.getDate())}T00:00:00`;
    
    const eDate = this.endDate;
    const endStr = `${eDate.getFullYear()}-${pad(eDate.getMonth() + 1)}-${pad(eDate.getDate())}T23:59:59`;

    const request: BookingRequest = {
        itemId: this.item.id,
        startDate: startStr,
        endDate: endStr
    };

    this.bookingService.createBooking(request).subscribe({
        next: (res) => {
            this.bookingLoading = false;
            this.bookingSuccess = true;
            // Clear dates on success
            setTimeout(() => {
               this.bookingSuccess = false;
               this.clearDates();
               this.loadUnavailableDates(this.item!.id);
            }, 3000); // revert back after success message
        },
        error: (err) => {
            this.bookingLoading = false;
            console.error('Booking failed', err);
            // In a real app add toast error
        }
    });
  }

  getMainImage(): string {
     if (!this.item || !this.item.images || this.item.images.length === 0) return 'assets/placeholder-item.png';
     const main = this.item.images.find(img => img.isMain);
     return main ? main.imageUrl : this.item.images[0].imageUrl;
  }
}
