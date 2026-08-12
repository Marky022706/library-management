import type { Borrowing } from '@/types';
import { daysAgo, daysFromNow } from '@/utils/date';

export const mockBorrowings: Borrowing[] = [
  { id: 'bw1', userId: 'u3', bookId: 'b5', requestedDate: daysAgo(6), borrowedDate: daysAgo(5), dueDate: daysFromNow(2), status: 'active' },
  { id: 'bw2', userId: 'u3', bookId: 'b16', requestedDate: daysAgo(31), borrowedDate: daysAgo(30), dueDate: daysAgo(23), returnedDate: daysAgo(24), status: 'returned' },
  { id: 'bw3', userId: 'u3', bookId: 'b9', requestedDate: daysAgo(1), dueDate: daysFromNow(7), status: 'pending' },
  { id: 'bw4', userId: 'u3', bookId: 'b23', requestedDate: daysAgo(15), dueDate: daysFromNow(-8), status: 'rejected' },
  { id: 'bw5', userId: 'u4', bookId: 'b6', requestedDate: daysAgo(21), borrowedDate: daysAgo(20), dueDate: daysAgo(6), status: 'overdue' },
  { id: 'bw6', userId: 'u4', bookId: 'b14', requestedDate: daysAgo(4), borrowedDate: daysAgo(3), dueDate: daysFromNow(4), status: 'active' },
  { id: 'bw7', userId: 'u5', bookId: 'b15', requestedDate: daysAgo(11), borrowedDate: daysAgo(10), dueDate: daysAgo(1), status: 'overdue' },
  { id: 'bw8', userId: 'u5', bookId: 'b7', requestedDate: daysAgo(61), borrowedDate: daysAgo(60), dueDate: daysAgo(53), returnedDate: daysAgo(55), status: 'returned' },
  { id: 'bw9', userId: 'u6', bookId: 'b1', requestedDate: daysAgo(0), dueDate: daysFromNow(7), status: 'pending' },
  { id: 'bw10', userId: 'u7', bookId: 'b2', requestedDate: daysAgo(26), borrowedDate: daysAgo(25), dueDate: daysAgo(11), status: 'overdue' },
  { id: 'bw11', userId: 'u8', bookId: 'b9', requestedDate: daysAgo(3), borrowedDate: daysAgo(2), dueDate: daysFromNow(5), status: 'active' },
  { id: 'bw12', userId: 'u8', bookId: 'b19', requestedDate: daysAgo(101), borrowedDate: daysAgo(100), dueDate: daysAgo(93), returnedDate: daysAgo(95), status: 'returned' },
  { id: 'bw13', userId: 'u9', bookId: 'b13', requestedDate: daysAgo(210), borrowedDate: daysAgo(209), dueDate: daysAgo(202), returnedDate: daysAgo(203), status: 'returned' },
  { id: 'bw14', userId: 'u10', bookId: 'b17', requestedDate: daysAgo(2), borrowedDate: daysAgo(1), dueDate: daysFromNow(6), status: 'active' },
];
