import type { AuditLog } from '@/types';
import { daysAgo } from '@/utils/date';

export const mockAuditLogs: AuditLog[] = [
  { id: 'al1', userId: 'u2', userName: 'Maricel Dagohoy', action: 'Added a new book', module: 'Book Management', description: 'Added "Sapiens: A Brief History of Humankind" to the catalog.', date: daysAgo(120) },
  { id: 'al2', userId: 'u3', userName: 'Juan Dela Cruz', action: 'Submitted a borrowing request', module: 'Borrowing', description: 'Requested to borrow "The Hobbit".', date: daysAgo(6) },
  { id: 'al3', userId: 'u1', userName: 'Ricardo Salazar', action: 'Approved a user', module: 'User Management', description: 'Approved registration for Precious Añora.', date: daysAgo(150) },
  { id: 'al4', userId: 'u2', userName: 'Maricel Dagohoy', action: 'Updated book information', module: 'Book Management', description: 'Updated condition and shelf location for "1984".', date: daysAgo(45) },
  { id: 'al5', userId: 'u3', userName: 'Juan Dela Cruz', action: 'Logged in', module: 'Authentication', description: 'Member logged in from the member portal.', date: daysAgo(0) },
  { id: 'al6', userId: 'u2', userName: 'Maricel Dagohoy', action: 'Approved a borrowing request', module: 'Requests', description: 'Approved borrowing request for "Atomic Habits" by Juan Dela Cruz.', date: daysAgo(30) },
  { id: 'al7', userId: 'u2', userName: 'Maricel Dagohoy', action: 'Rejected a borrowing request', module: 'Requests', description: 'Rejected borrowing request for "The Little Prince" by Juan Dela Cruz.', date: daysAgo(14) },
  { id: 'al8', userId: 'u11', userName: 'Teodoro Villanueva', action: 'Archived a book', module: 'Book Management', description: 'Archived "Balingasag: A Local History" due to poor condition.', date: daysAgo(900) },
  { id: 'al9', userId: 'u1', userName: 'Ricardo Salazar', action: 'Updated system settings', module: 'Settings', description: 'Changed maximum borrowing limit from 2 to 3 books per member.', date: daysAgo(200) },
  { id: 'al10', userId: 'u4', userName: 'Angeline Bacus', action: 'Logged in', module: 'Authentication', description: 'Member logged in from the member portal.', date: daysAgo(2) },
  { id: 'al11', userId: 'u2', userName: 'Maricel Dagohoy', action: 'Suspended a user', module: 'User Management', description: 'Suspended account of Bryan Otom-ot for repeated overdue books.', date: daysAgo(35) },
  { id: 'al12', userId: 'u3', userName: 'Juan Dela Cruz', action: 'Updated profile', module: 'Profile', description: 'Updated contact phone number.', date: daysAgo(9) },
  { id: 'al13', userId: 'u2', userName: 'Maricel Dagohoy', action: 'Published an announcement', module: 'Announcements', description: 'Published "Extended Weekend Hours Starting September".', date: daysAgo(9) },
  { id: 'al14', userId: 'u1', userName: 'Ricardo Salazar', action: 'Created a backup', module: 'Backup & Restore', description: 'Manually triggered a full system backup.', date: daysAgo(7) },
  { id: 'al15', userId: 'u2', userName: 'Maricel Dagohoy', action: 'Recorded attendance', module: 'Attendance', description: 'Recorded time-in for Cherry Mae Landas via QR scan.', date: daysAgo(0) },
  { id: 'al16', userId: 'u11', userName: 'Teodoro Villanueva', action: 'Approved an acquisition request', module: 'Requests', description: 'Approved acquisition request for "Educated by Tara Westover".', date: daysAgo(18) },
  { id: 'al17', userId: 'u1', userName: 'Ricardo Salazar', action: 'Restored a record', module: 'Recycle Bin', description: 'Restored an accidentally archived book record.', date: daysAgo(60) },
  { id: 'al18', userId: 'u2', userName: 'Maricel Dagohoy', action: 'Generated a report', module: 'Reports', description: 'Generated the monthly Borrowing Trends report.', date: daysAgo(4) },
  { id: 'al19', userId: 'u5', userName: 'Ferdinand Tampos', action: 'Logged in', module: 'Authentication', description: 'Member logged in from the member portal.', date: daysAgo(5) },
  { id: 'al20', userId: 'u2', userName: 'Maricel Dagohoy', action: 'Activated a user', module: 'User Management', description: 'Activated account of Cherry Mae Landas after document verification.', date: daysAgo(190) },
  { id: 'al21', userId: 'u1', userName: 'Ricardo Salazar', action: 'Assigned a role', module: 'User Management', description: 'Assigned admin role to Teodoro Villanueva.', date: daysAgo(500) },
  { id: 'al22', userId: 'u8', userName: 'Cherry Mae Landas', action: 'Added a favorite', module: 'Favorites', description: 'Added "1984" to favorites.', date: daysAgo(3) },
];
