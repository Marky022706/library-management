import { CheckCircle2, Info, AlertTriangle, AlertCircle, Check } from 'lucide-react';
import type { AppNotification, NotificationType } from '@/types';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';
import { timeAgo } from '@/utils/date';

export interface NotificationItemProps {
  notification: AppNotification;
  onMarkRead?: (id: string) => void;
  isMarking?: boolean;
}

const TYPE_ICON: Record<NotificationType, typeof Info> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
};

const TYPE_CLASSES: Record<NotificationType, string> = {
  success: 'bg-emerald-50 text-emerald-600',
  info: 'bg-blue-50 text-blue-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
};

export function NotificationItem({ notification, onMarkRead, isMarking }: NotificationItemProps) {
  const Icon = TYPE_ICON[notification.type];

  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border-l-4 p-3.5 transition-colors',
        notification.read ? 'border-transparent bg-white' : 'border-primary-500 bg-primary-50/50',
      )}
    >
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', TYPE_CLASSES[notification.type])}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <p className={cn('text-sm', notification.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-900')}>
            {notification.title}
          </p>
          <span className="shrink-0 text-xs text-gray-400">{timeAgo(notification.createdAt)}</span>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">{notification.message}</p>
        {onMarkRead && !notification.read && (
          <div className="mt-2">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Check className="h-3.5 w-3.5" />}
              isLoading={isMarking}
              onClick={() => onMarkRead(notification.id)}
            >
              Mark as read
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
