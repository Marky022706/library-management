import type { Notification } from '../types';

export const notifications: Notification[] = [
  { id: 'ntf-1', title: 'New borrowing request', message: "Maria Santos requested to borrow 'The Little Prince'.", type: 'info', read: false, createdAt: '2025-08-08T09:12:00' },
  { id: 'ntf-2', title: 'Book fully checked out', message: "'El Filibusterismo' has 0 copies available.", type: 'warning', read: false, createdAt: '2025-08-07T15:40:00' },
  { id: 'ntf-3', title: 'Overdue loan', message: "Pedro Dela Cruz's loan of 'Florante at Laura' is overdue.", type: 'danger', read: false, createdAt: '2025-08-06T11:05:00' },
  { id: 'ntf-4', title: 'Announcement published', message: "'Library Closure on Ninoy Aquino Day' is now live.", type: 'success', read: true, createdAt: '2025-08-08T08:00:00' },
  { id: 'ntf-5', title: 'Pending registration', message: 'Ana Gonzales is awaiting account approval.', type: 'info', read: true, createdAt: '2025-07-20T10:00:00' },
];
