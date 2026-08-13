import {
  LayoutGrid,
  BookOpen,
  Users,
  ClipboardList,
  CalendarCheck,
  BarChart3,
  Megaphone,
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

export const memberNavItems: NavItem[] = [{ to: 'dashboard', label: 'Dashboard', icon: LayoutGrid }];
