import {
  LayoutGrid,
  BookOpen,
  Users,
  ClipboardList,
  CalendarCheck,
  BarChart3,
  Megaphone,
  Settings,
  FileText,
  Database,
  Trash2,
  UserCheck,
  Library,
  Bookmark,
  Heart,
  History,
  Bell,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { to: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: 'books', label: 'Book Management', icon: BookOpen },
  { to: 'users', label: 'User Management', icon: Users },
  { to: 'requests', label: 'Request Management', icon: ClipboardList },
  { to: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { to: 'reports', label: 'Reports', icon: BarChart3 },
  { to: 'announcements', label: 'Announcements', icon: Megaphone },
];

export const superAdminNavItems: NavItem[] = [
  { to: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: 'books', label: 'Book Management', icon: BookOpen },
  { to: 'users', label: 'User Management', icon: Users },
  { to: 'requests', label: 'Request Management', icon: ClipboardList },
  { to: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { to: 'reports', label: 'Reports', icon: BarChart3 },
  { to: 'settings', label: 'System Settings', icon: Settings },
  { to: 'logs', label: 'System Logs', icon: FileText },
  { to: 'backup', label: 'Backup & Restore', icon: Database },
  { to: 'recycle-bin', label: 'Recycle Bin', icon: Trash2 },
  { to: 'profile', label: 'Profile', icon: UserCheck },
];

export const memberNavItems: NavItem[] = [
  { to: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: 'catalog', label: 'Book Catalog', icon: BookOpen },
  { to: 'my-books', label: 'My Books', icon: Library },
  { to: 'reservations', label: 'Reservations', icon: Bookmark },
  { to: 'favorites', label: 'Favorites', icon: Heart },
  { to: 'history', label: 'Activity History', icon: History },
  { to: 'notifications', label: 'Notifications', icon: Bell },
  { to: 'profile', label: 'Profile', icon: UserCheck },
];
