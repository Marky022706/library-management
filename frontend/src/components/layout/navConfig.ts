import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  History,
  Bell,
  Heart,
  User,
  Users,
  ClipboardList,
  QrCode,
  BarChart3,
  Megaphone,
  SlidersHorizontal,
  FileClock,
  Terminal,
  Trash2,
  DatabaseBackup,
} from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export const memberNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/member/dashboard', icon: LayoutDashboard },
  { label: 'Book Catalog', to: '/member/catalog', icon: BookOpen },
  { label: 'My Books', to: '/member/my-books', icon: BookMarked },
  { label: 'Activity History', to: '/member/activity', icon: History },
  { label: 'Notifications', to: '/member/notifications', icon: Bell },
  { label: 'Favorites', to: '/member/favorites', icon: Heart },
  { label: 'Profile', to: '/member/profile', icon: User },
];

export const adminNavItems: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Book Management', to: '/admin/books', icon: BookOpen },
  { label: 'User Management', to: '/admin/users', icon: Users },
  { label: 'Request Management', to: '/admin/requests', icon: ClipboardList },
  { label: 'Attendance', to: '/admin/attendance', icon: QrCode },
  { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
  { label: 'Announcements', to: '/admin/announcements', icon: Megaphone },
];

export const superAdminOnlyNavItems: NavItem[] = [
  { label: 'Settings', to: '/admin/settings', icon: SlidersHorizontal },
  { label: 'Audit Logs', to: '/admin/audit-logs', icon: FileClock },
  { label: 'System Logs', to: '/admin/system-logs', icon: Terminal },
  { label: 'Recycle Bin', to: '/admin/recycle-bin', icon: Trash2 },
  { label: 'Backup & Restore', to: '/admin/backup-restore', icon: DatabaseBackup },
];
