import type { AppNotification } from '@/types';
import { daysAgo } from '@/utils/date';

export const mockNotifications: AppNotification[] = [
  { id: 'n1', userId: 'u3', title: 'Borrowing request approved', message: 'Your borrowing request for "The Hobbit" was approved.', type: 'success', read: false, createdAt: daysAgo(5) },
  { id: 'n2', userId: 'u3', title: 'Due date reminder', message: '"The Hobbit" is due in 2 days. Please return or renew it on time.', type: 'warning', read: false, createdAt: daysAgo(0) },
  { id: 'n3', userId: 'u3', title: 'New arrival', message: 'A new book, "Sapiens: A Brief History of Humankind", has been added to the catalog.', type: 'info', read: false, createdAt: daysAgo(1) },
  { id: 'n4', userId: 'u3', title: 'Reservation ready', message: 'Your reservation for "1984" is next in line for pickup.', type: 'info', read: true, createdAt: daysAgo(2) },
  { id: 'n5', userId: 'u3', title: 'Borrow request rejected', message: 'Your request to borrow "The Little Prince" was declined — all copies are currently reserved.', type: 'danger', read: true, createdAt: daysAgo(15) },
  { id: 'n6', userId: 'u3', title: 'Welcome to the library', message: 'Your account has been approved. Enjoy browsing the Balingasag Public Library catalog!', type: 'success', read: true, createdAt: daysAgo(410) },
  { id: 'n7', userId: 'u4', title: 'Overdue notice', message: '"The Lord of the Rings" is overdue by 6 days. Please return it to avoid penalties.', type: 'danger', read: false, createdAt: daysAgo(0) },
  { id: 'n8', userId: 'u4', title: 'Borrowing request approved', message: 'Your borrowing request for "Clean Code" was approved.', type: 'success', read: true, createdAt: daysAgo(3) },
  { id: 'n9', userId: 'u5', title: 'Overdue notice', message: '"Introduction to Algorithms" is overdue by 1 day. Please return it as soon as possible.', type: 'danger', read: false, createdAt: daysAgo(0) },
  { id: 'n10', userId: 'u6', title: 'Account pending approval', message: 'Your account registration is pending review by a library administrator.', type: 'info', read: false, createdAt: daysAgo(2) },
  { id: 'n11', userId: 'u8', title: 'Reservation fulfilled', message: 'Your reservation for "The Lord of the Rings" has been fulfilled.', type: 'success', read: true, createdAt: daysAgo(17) },
  { id: 'n12', userId: 'u10', title: 'Borrowing request approved', message: 'Your borrowing request for "Rich Dad Poor Dad" was approved.', type: 'success', read: false, createdAt: daysAgo(1) },
  { id: 'n13', userId: 'u2', title: 'New acquisition request', message: 'A member submitted a new acquisition request for review.', type: 'info', read: false, createdAt: daysAgo(0) },
];
