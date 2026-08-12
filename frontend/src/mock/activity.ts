import type { ActivityLogEntry } from '@/types';
import { daysAgo } from '@/utils/date';

export const mockActivity: ActivityLogEntry[] = [
  { id: 'act1', userId: 'u3', type: 'Login', description: 'Logged in to the member portal.', date: daysAgo(0) },
  { id: 'act2', userId: 'u3', type: 'Attendance', description: 'Checked in at the library via QR scan.', date: daysAgo(0) },
  { id: 'act3', userId: 'u3', type: 'Borrow Request', description: 'Requested to borrow "1984".', date: daysAgo(1) },
  { id: 'act4', userId: 'u3', type: 'Favorite Added', description: 'Added "1984" to favorites.', date: daysAgo(3) },
  { id: 'act5', userId: 'u3', type: 'Book Borrowed', description: 'Borrowed "The Hobbit" — due in 7 days.', date: daysAgo(5) },
  { id: 'act6', userId: 'u3', type: 'Profile Updated', description: 'Updated phone number on profile.', date: daysAgo(9) },
  { id: 'act7', userId: 'u3', type: 'Reservation', description: 'Reservation request submitted for "1984".', date: daysAgo(2) },
  { id: 'act8', userId: 'u3', type: 'Book Returned', description: 'Returned "Atomic Habits".', date: daysAgo(24) },
  { id: 'act9', userId: 'u3', type: 'Borrow Request', description: 'Requested to borrow "The Little Prince" (declined).', date: daysAgo(15) },
  { id: 'act10', userId: 'u3', type: 'Favorite Added', description: 'Added "Sapiens: A Brief History of Humankind" to favorites.', date: daysAgo(20) },
  { id: 'act11', userId: 'u3', type: 'Login', description: 'Logged in to the member portal.', date: daysAgo(2) },
  { id: 'act12', userId: 'u3', type: 'Login', description: 'Registered a new account.', date: daysAgo(410) },
];
