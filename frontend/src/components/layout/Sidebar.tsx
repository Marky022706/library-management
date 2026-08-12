import { NavLink } from 'react-router-dom';
import { BookOpenCheck, LogOut, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import type { NavItem } from './navConfig';

export interface SidebarProps {
  navItems: NavItem[];
  roleLabel: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ navItems, roleLabel, isOpen, onClose }: SidebarProps) {
  const { currentUser, logout } = useAuth();

  const content = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-gray-900">Balingasag Library</p>
            <p className="text-xs leading-tight text-gray-500">{roleLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 md:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )
            }
          >
            <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <div className="mb-2 flex items-center gap-2 rounded-lg px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            {currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest'}
            </p>
            <p className="truncate text-xs text-gray-500">{currentUser?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 md:block">{content}</aside>

      {/* Mobile drawer */}
      <div className={cn('fixed inset-0 z-40 md:hidden', isOpen ? '' : 'pointer-events-none')}>
        <div
          className={cn('absolute inset-0 bg-gray-900/50 transition-opacity', isOpen ? 'opacity-100' : 'opacity-0')}
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl transition-transform duration-200 ease-out',
            isOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          {content}
        </div>
      </div>
    </>
  );
}
