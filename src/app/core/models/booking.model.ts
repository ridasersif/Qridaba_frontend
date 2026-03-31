export interface BookingRequest {
  itemId: string;
  startDate: string; // ISO Date String
  endDate: string; // ISO Date String
}

export interface BookingResponse {
  id: string;
  itemId: string;
  itemTitle: string;
  renterId: string;
  renterName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}
