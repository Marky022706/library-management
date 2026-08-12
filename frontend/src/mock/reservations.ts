import type { Reservation } from '@/types';
import { daysAgo, daysFromNow } from '@/utils/date';

export const mockReservations: Reservation[] = [
  { id: 'r1', userId: 'u3', bookId: 'b9', reservedDate: daysAgo(2), expiryDate: daysFromNow(1), status: 'pending' },
  { id: 'r2', userId: 'u4', bookId: 'b15', reservedDate: daysAgo(5), expiryDate: daysFromNow(2), status: 'ready' },
  { id: 'r3', userId: 'u5', bookId: 'b5', reservedDate: daysAgo(1), expiryDate: daysFromNow(2), status: 'pending' },
  { id: 'r4', userId: 'u6', bookId: 'b9', reservedDate: daysAgo(10), expiryDate: daysAgo(7), status: 'cancelled' },
  { id: 'r5', userId: 'u8', bookId: 'b6', reservedDate: daysAgo(20), expiryDate: daysAgo(17), status: 'fulfilled' },
  { id: 'r6', userId: 'u10', bookId: 'b15', reservedDate: daysAgo(15), expiryDate: daysAgo(12), status: 'expired' },
];
