import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLibrary } from '@/hooks/useLibrary';
import { cn } from '@/utils/cn';
import { timeAgo } from '@/utils/date';
import { Badge } from '@/components/ui/Badge';

export interface NavbarProps {
  title: string;
  onMenuClick: () => void;
}

export function Navbar({ title, onMenuClick }: NavbarProps) {
  const { currentUser, logout } = useAuth();
  const { notificationsByUser, markNotificationRead } = useLibrary();
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const notifications = currentUser ? notificationsByUser(currentUser.id) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const recent = notifications.slice(0, 5);
  const notificationsHref = currentUser?.role === 'member' ? '/member/notifications' : '/admin/dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-80 max-w-[90vw] rounded-xl border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {recent.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-gray-500">You're all caught up.</p>
                  ) : (
                    recent.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => markNotificationRead(n.id)}
                        className={cn('flex w-full flex-col items-start gap-0.5 border-b border-gray-50 px-4 py-3 text-left hover:bg-gray-50', !n.read && 'bg-primary-50/40')}
                      >
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-sm font-medium text-gray-900">{n.title}</span>
                          {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />}
                        </div>
                        <span className="line-clamp-2 text-xs text-gray-500">{n.message}</span>
                        <span className="text-[11px] text-gray-400">{timeAgo(n.createdAt)}</span>
                      </button>
                    ))
                  )}
                </div>
                <Link
                  to={notificationsHref}
                  onClick={() => setNotifOpen(false)}
                  className="block border-t border-gray-100 px-4 py-2.5 text-center text-sm font-medium text-primary-700 hover:bg-primary-50"
                >
                  View all notifications
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100"
            aria-label="Account menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
              {currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : '?'}
            </div>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                <div className="px-2.5 py-2">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="truncate text-xs text-gray-500">{currentUser?.email}</p>
                  <div className="mt-1">
                    <Badge variant="primary">{currentUser?.role}</Badge>
                  </div>
                </div>
                {currentUser?.role === 'member' && (
                  <Link
                    to="/member/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    <UserIcon className="h-4 w-4" /> Profile
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
