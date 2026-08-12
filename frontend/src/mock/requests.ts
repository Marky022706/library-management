import type { LibraryRequest } from '@/types';
import { daysAgo } from '@/utils/date';

export const mockRequests: LibraryRequest[] = [
  { id: 'req1', type: 'Borrowing', requesterId: 'u3', bookId: 'b9', bookTitle: '1984', borrowingId: 'bw3', details: 'Request to borrow "1984".', date: daysAgo(1), status: 'pending' },
  { id: 'req2', type: 'Borrowing', requesterId: 'u6', bookId: 'b1', bookTitle: 'Noli Me Tangere', borrowingId: 'bw9', details: 'Request to borrow "Noli Me Tangere".', date: daysAgo(0), status: 'pending' },
  { id: 'req3', type: 'Borrowing', requesterId: 'u3', bookId: 'b16', bookTitle: 'Atomic Habits', borrowingId: 'bw2', details: 'Request to borrow "Atomic Habits".', date: daysAgo(31), status: 'approved', approverId: 'u2', resolvedDate: daysAgo(30) },
  { id: 'req4', type: 'Borrowing', requesterId: 'u3', bookId: 'b23', bookTitle: 'The Little Prince', borrowingId: 'bw4', details: 'Request to borrow "The Little Prince".', date: daysAgo(15), status: 'rejected', approverId: 'u2', resolvedDate: daysAgo(14) },
  { id: 'req5', type: 'Borrowing', requesterId: 'u7', bookId: 'b2', bookTitle: 'El Filibusterismo', borrowingId: 'bw10', details: 'Request to borrow "El Filibusterismo".', date: daysAgo(26), status: 'approved', approverId: 'u11', resolvedDate: daysAgo(25) },
  { id: 'req6', type: 'Archive', requesterId: 'u2', bookId: 'b25', bookTitle: 'Balingasag: A Local History', details: 'Book copies severely worn; recommend archiving.', date: daysAgo(910), status: 'approved', approverId: 'u1', resolvedDate: daysAgo(900) },
  { id: 'req7', type: 'Archive', requesterId: 'u11', bookId: 'b18', bookTitle: 'The Diary of a Young Girl', details: 'Cover damaged and pages loose; needs review for archiving.', date: daysAgo(5), status: 'pending' },
  { id: 'req8', type: 'Archive', requesterId: 'u2', bookId: 'b9', bookTitle: '1984', details: 'Multiple copies worn; requesting condition review.', date: daysAgo(3), status: 'pending' },
  { id: 'req9', type: 'Acquisition', requesterId: 'u4', bookTitle: 'Educated by Tara Westover', details: 'Member-suggested acquisition — memoir frequently requested by the book club.', date: daysAgo(20), status: 'approved', approverId: 'u1', resolvedDate: daysAgo(18) },
  { id: 'req10', type: 'Acquisition', requesterId: 'u8', bookTitle: 'The Silent Patient', details: 'Requesting a popular mystery/thriller title for the fiction section.', date: daysAgo(6), status: 'pending' },
  { id: 'req11', type: 'Acquisition', requesterId: 'u10', bookTitle: 'Filipino Cuisine Cookbook (Local Edition)', details: 'Suggested addition to support the culinary skills program.', date: daysAgo(40), status: 'rejected', approverId: 'u2', resolvedDate: daysAgo(38) },
  { id: 'req12', type: 'Borrowing', requesterId: 'u5', bookId: 'b15', bookTitle: 'Introduction to Algorithms', borrowingId: 'bw7', details: 'Request to borrow "Introduction to Algorithms".', date: daysAgo(11), status: 'approved', approverId: 'u2', resolvedDate: daysAgo(10) },
];
