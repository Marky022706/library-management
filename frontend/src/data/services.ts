import {
  BellRing,
  BookCopy,
  BookOpenCheck,
  CalendarRange,
  CreditCard,
  ScanLine,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface LibraryService {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const services: LibraryService[] = [
  { id: 'borrowing', title: 'Book Borrowing', description: 'Borrow physical titles from our growing municipal collection.', icon: BookOpenCheck },
  { id: 'reservations', title: 'Online Reservations', description: 'Reserve a book online and pick it up at the circulation desk.', icon: CalendarRange },
  { id: 'membership', title: 'Library Membership', description: 'Create a digital library card to borrow, reserve, and track history.', icon: CreditCard },
  { id: 'attendance', title: 'QR Attendance', description: 'Check in with a quick QR scan when you visit the library.', icon: ScanLine },
  { id: 'acquisition', title: 'Book Acquisition Requests', description: "Suggest a title you'd like the library to add to its collection.", icon: BookCopy },
  { id: 'notifications', title: 'Digital Notifications', description: 'Get reminders for due dates, holds, and approved requests.', icon: BellRing },
  { id: 'resources', title: 'Reading Resources', description: 'Access curated reading lists and municipal learning materials.', icon: Sparkles },
  { id: 'programs', title: 'Community Programs', description: 'Join reading circles, workshops, and other library-led events.', icon: Users },
];
