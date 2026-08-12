export type ActivityType =
  | 'Login'
  | 'Borrow Request'
  | 'Book Borrowed'
  | 'Book Returned'
  | 'Reservation'
  | 'Profile Updated'
  | 'Attendance'
  | 'Favorite Added';

export interface ActivityLogEntry {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  date: string;
}
