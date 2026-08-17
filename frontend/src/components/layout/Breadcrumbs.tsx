import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  superadmin: 'Super Admin',
  super_admin: 'Super Admin',
  admin: 'Admin',
  member: 'Member',
  dashboard: 'Dashboard',
  books: 'Book Management',
  users: 'User Management',
  requests: 'Request Management',
  attendance: 'Attendance',
  reports: 'Reports & Analytics',
  settings: 'System Settings',
  logs: 'System Logs',
  backup: 'Backup & Restore',
  catalog: 'Book Catalog',
  'my-books': 'My Books',
  reservations: 'Reservations',
  favorites: 'Favorites',
  history: 'Activity History',
  notifications: 'Notifications',
  profile: 'Profile',
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  const roleRoot = pathnames[0];
  const dashboardLink = `/${roleRoot}/dashboard`;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium" aria-label="Breadcrumb">
      <Link
        to={dashboardLink}
        className="flex items-center gap-1 text-slate-400 hover:text-emerald-700 transition-colors"
        title="Dashboard"
      >
        <Home className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {pathnames.map((segment, index) => {
        const isLast = index === pathnames.length - 1;
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = ROUTE_LABELS[segment.toLowerCase()] || segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div key={routeTo} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" aria-hidden="true" />
            {isLast ? (
              <span className="font-semibold text-slate-800 truncate max-w-45 sm:max-w-none">
                {label}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="text-slate-500 hover:text-emerald-700 transition-colors truncate max-w-30 sm:max-w-none"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
