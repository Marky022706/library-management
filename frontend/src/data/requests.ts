import type { BorrowRequest } from '../types';

// 7 borrowing + 2 acquisition + 1 archive = 10, matching the tab counts.
// Exactly 2 requests are `pending` (REQ1, REQ5) and exactly 4 borrowing
// requests are active loans (approved, not yet returned) with 2 of those
// past their due date — so Pending Requests / Borrowed / Overdue on the
// dashboard all fall out of this data instead of being separately hardcoded.
export const requests: BorrowRequest[] = [
  { id: 'REQ1', type: 'borrowing', requesterId: 'u-1', bookId: 'bk-19', note: 'The Little Prince', date: '2025-08-08', status: 'pending' },
  { id: 'REQ2', type: 'borrowing', requesterId: 'u-4', bookId: 'bk-4', note: 'Ibong Adarna', date: '2025-07-30', status: 'approved', approverId: 'u-2', resolvedDate: '2025-07-30', dueDate: '2025-08-13' },
  { id: 'REQ3', type: 'borrowing', requesterId: 'u-1', bookId: 'bk-1', note: 'Florante at Laura', date: '2025-07-28', status: 'approved', approverId: 'u-2', resolvedDate: '2025-07-28', dueDate: '2025-08-04' },
  { id: 'REQ4', type: 'borrowing', requesterId: 'u-4', bookId: 'bk-9', note: 'The Power of Now', date: '2025-08-01', status: 'approved', approverId: 'u-2', resolvedDate: '2025-08-01', dueDate: '2025-08-15' },
  { id: 'REQ5', type: 'acquisition', requesterId: 'u-1', note: "Requesting acquisition of 'The Fault in Our Stars' for the Story section.", date: '2025-08-01', status: 'pending' },
  { id: 'REQ6', type: 'acquisition', requesterId: 'u-6', note: "Requesting 'Python Crash Course' for the Technology section.", date: '2025-07-25', status: 'approved', approverId: 'u-8', resolvedDate: '2025-07-26' },
  { id: 'REQ7', type: 'borrowing', requesterId: 'u-9', bookId: 'bk-12', note: 'English Grammar Toolkit', date: '2025-08-05', status: 'approved', approverId: 'u-8', resolvedDate: '2025-08-05', dueDate: '2025-07-30' },
  { id: 'REQ8', type: 'borrowing', requesterId: 'u-10', bookId: 'bk-2', note: 'Noli Me Tangere', date: '2025-07-20', status: 'approved', approverId: 'u-2', resolvedDate: '2025-07-20', dueDate: '2025-07-27', returnedAt: '2025-07-26' },
  { id: 'REQ9', type: 'borrowing', requesterId: 'u-6', bookId: 'bk-14', note: 'Cosmos', date: '2025-07-15', status: 'rejected', approverId: 'u-2', resolvedDate: '2025-07-16' },
  { id: 'REQ10', type: 'archive', requesterId: 'u-4', bookId: 'bk-21', note: "Requesting to archive 'Physics Made Simple' — outdated edition, worn condition.", date: '2025-08-02', status: 'approved', approverId: 'u-3', resolvedDate: '2025-08-03' },
];
