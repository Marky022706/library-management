import { useMemo } from 'react';
import { LogIn, Send, BookOpenCheck, RotateCcw, Bookmark, UserCog, QrCode, Heart, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLibrary } from '@/hooks/useLibrary';
import { EmptyState } from '@/components/ui';
import { cn } from '@/utils/cn';
import { formatDateTime, timeAgo } from '@/utils/date';
import type { ActivityType } from '@/types';

const TYPE_ICON: Record<ActivityType, LucideIcon> = {
  Login: LogIn,
  'Borrow Request': Send,
  'Book Borrowed': BookOpenCheck,
  'Book Returned': RotateCcw,
  Reservation: Bookmark,
  'Profile Updated': UserCog,
  Attendance: QrCode,
  'Favorite Added': Heart,
};

const TYPE_CLASSES: Record<ActivityType, string> = {
  Login: 'bg-gray-100 text-gray-600',
  'Borrow Request': 'bg-blue-50 text-blue-600',
  'Book Borrowed': 'bg-primary-50 text-primary-600',
  'Book Returned': 'bg-emerald-50 text-emerald-600',
  Reservation: 'bg-indigo-50 text-indigo-600',
  'Profile Updated': 'bg-gray-100 text-gray-600',
  Attendance: 'bg-teal-50 text-teal-600',
  'Favorite Added': 'bg-red-50 text-red-600',
};

export function ActivityHistory() {
  const { currentUser } = useAuth();
  const lib = useLibrary();

  const userId = currentUser?.id ?? '';
  const activity = lib.activityByUser(userId);

  const sorted = useMemo(
    () => [...activity].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [activity],
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Activity History</h1>

      {sorted.length === 0 ? (
        <EmptyState title="No activity yet" description="Your account activity will appear here as you use the library." />
      ) : (
        <div className="relative">
          <div className="absolute top-2 bottom-2 left-4 w-px bg-gray-200" aria-hidden="true" />
          <ul className="space-y-5">
            {sorted.map((entry) => {
              const Icon = TYPE_ICON[entry.type];
              return (
                <li key={entry.id} className="relative flex gap-4 pl-0">
                  <div
                    className={cn(
                      'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-gray-50',
                      TYPE_CLASSES[entry.type],
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                      <p className="text-sm font-semibold text-gray-900">{entry.type}</p>
                      <span className="text-xs text-gray-400" title={formatDateTime(entry.date)}>
                        {timeAgo(entry.date)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-600">{entry.description}</p>
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
