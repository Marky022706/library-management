import { Bell, Clock, BookOpen, Megaphone, ArrowRight } from 'lucide-react';

interface NotificationItem {
  id: string;
  category: 'due' | 'reservation' | 'announcement' | 'account';
  title: string;
  message: string;
  timeAgo: string;
  unread: boolean;
}

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    category: 'due',
    title: 'Due Date Reminder',
    message: 'Your borrowed book "The Great Gatsby" is due in 2 days.',
    timeAgo: '5 minutes ago',
    unread: true,
  },
  {
    id: 'n-2',
    category: 'reservation',
    title: 'Reservation Ready',
    message: 'Your hold on "Database Systems (10th Ed)" is ready at the circulation counter.',
    timeAgo: '1 hour ago',
    unread: true,
  },
  {
    id: 'n-3',
    category: 'announcement',
    title: 'Library Holiday Notice',
    message: 'The Balingasag Public Library will be closed on August 20 for municipal holiday.',
    timeAgo: 'Yesterday',
    unread: false,
  },
];

const ICONS_BY_CATEGORY = {
  due: { icon: Clock, color: 'text-amber-700 bg-amber-50' },
  reservation: { icon: BookOpen, color: 'text-emerald-700 bg-emerald-50' },
  announcement: { icon: Megaphone, color: 'text-blue-700 bg-blue-50' },
  account: { icon: Bell, color: 'text-purple-700 bg-purple-50' },
};

interface MemberNotificationsProps {
  onViewAll?: () => void;
}

export function MemberNotifications({ onViewAll }: MemberNotificationsProps) {
  return (
    <div className="flex flex-col gap-3">
      {SAMPLE_NOTIFICATIONS.map((item) => {
        const iconConfig = ICONS_BY_CATEGORY[item.category] || ICONS_BY_CATEGORY.account;
        const Icon = iconConfig.icon;

        return (
          <div
            key={item.id}
            className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
              item.unread
                ? 'border-emerald-200/80 bg-emerald-50/30 hover:bg-emerald-50/60'
                : 'border-slate-100 bg-slate-50/70 hover:bg-slate-100/70'
            }`}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-2xs ${iconConfig.color}`}>
              <Icon className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs font-bold text-slate-900">{item.title}</p>
                <span className="text-[10px] text-slate-400 shrink-0">{item.timeAgo}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-600 line-clamp-2">{item.message}</p>
            </div>
          </div>
        );
      })}

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors shadow-2xs"
        >
          <span>View All Notifications</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
