import { useEffect, useRef, useState } from 'react';
import { Bell, CheckCircle2, Info, TriangleAlert, XCircle } from 'lucide-react';
import { notifications as initialNotifications } from '../../data/notifications';
import type { NotificationType } from '../../types';
import { cn } from '../../utils/cn';

const ICONS: Record<NotificationType, typeof Bell> = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
  danger: XCircle,
};

const ICON_TONE: Record<NotificationType, string> = {
  success: 'text-primary-600',
  info: 'text-blue-600',
  warning: 'text-amber-600',
  danger: 'text-red-600',
};

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const containerRef = useRef<HTMLDivElement>(null);
  const unreadCount = items.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        title="Notifications"
        className="relative rounded-full p-2 text-muted hover:bg-gray-100 hover:text-ink"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-line bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Notifications</p>
            <button type="button" onClick={markAllRead} className="text-xs font-medium text-primary-700 hover:underline">
              Mark all read
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {items.map((n) => {
              const Icon = ICONS[n.type];
              return (
                <li key={n.id} className={cn('flex gap-3 border-b border-line px-4 py-3 last:border-0', !n.read && 'bg-primary-50/40')}>
                  <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', ICON_TONE[n.type])} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{n.message}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
