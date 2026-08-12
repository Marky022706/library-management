export type ReservationStatus = 'pending' | 'ready' | 'fulfilled' | 'cancelled' | 'expired';

export interface Reservation {
  id: string;
  bookId: string;
  userId: string;
  reservedDate: string;
  expiryDate: string;
  status: ReservationStatus;
}
