import { useMemo, useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLibrary } from '@/hooks/useLibrary';
import { useToast } from '@/hooks/useToast';
import { Button, EmptyState } from '@/components/ui';
import { NotificationItem } from '@/components/notifications/NotificationItem';

export function Notifications() {
  const { currentUser } = useAuth();
  const lib = useLibrary();
  const toast = useToast();

  const userId = currentUser?.id ?? '';
  const notifications = lib.notificationsByUser(userId);

  const [markingId, setMarkingId] = useState<string | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const sorted = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notifications],
  );
  const unreadCount = sorted.filter((n) => !n.read).length;

  const handleMarkRead = async (id: string) => {
    setMarkingId(id);
    try {
      await lib.markNotificationRead(id);
      toast.success('Notification marked as read.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to mark notification as read.');
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    if (!currentUser) return;
    setIsMarkingAll(true);
    try {
      await lib.markAllNotificationsRead(currentUser.id);
      toast.success('All notifications marked as read.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to mark all notifications as read.');
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<CheckCheck className="h-4 w-4" />}
          isLoading={isMarkingAll}
          disabled={unreadCount === 0}
          onClick={handleMarkAllRead}
        >
          Mark all as read
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="No notifications" description="You don't have any notifications yet." />
      ) : (
        <div className="space-y-2">
          {sorted.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={handleMarkRead}
              isMarking={markingId === notification.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
