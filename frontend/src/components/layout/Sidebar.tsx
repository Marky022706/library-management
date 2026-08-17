import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, LogOut } from 'lucide-react';
import type { NavItem } from './navConfig';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

interface SidebarProps {
  basePath: string;
  roleLabel?: string;
  userName?: string;
  navItems: NavItem[];
  sectionLabel: string;
  isSuperAdmin?: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  basePath,
  navItems,
  sectionLabel,
  isSuperAdmin = false,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden" onClick={onCloseMobile} aria-hidden="true" />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-62.5 flex-col bg-sidebar transition-transform duration-200 lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center gap-3 px-5 pb-6 pt-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-bold text-white">Balingasag</p>
            <p className="truncate text-xs text-primary-100">Public Library</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          <p className="px-2 pb-2 text-xs font-semibold tracking-wider text-primary-100">{sectionLabel}</p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={`${basePath}/${item.to}`}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive ? 'bg-sidebar-active text-white' : 'text-primary-50/90 hover:bg-sidebar-hover hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {isSuperAdmin && (
            <p className="mt-6 px-2 pb-2 text-xs font-semibold tracking-wider text-primary-100">SUPER ADMIN</p>
          )}
        </nav>

        <div className="px-3 pb-6 pt-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-50/90 hover:bg-sidebar-hover hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
