import type { AppNotification, NotificationType } from '@/types';
import { mockNotifications } from '@/mock';
import { generateId } from '@/utils/id';
import { isoDate } from '@/utils/date';
import { wait } from '@/utils/wait';

let notifications: AppNotification[] = [...mockNotifications];

export async function getAll(): Promise<AppNotification[]> {
  await wait();
  return notifications;
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
}

export async function create(input: CreateNotificationInput): Promise<AppNotification> {
  await wait(120);
  const notification: AppNotification = {
    id: generateId('n'),
    userId: input.userId,
    title: input.title,
    message: input.message,
    type: input.type ?? 'info',
    link: input.link,
    read: false,
    createdAt: isoDate(new Date()),
  };
  notifications = [notification, ...notifications];
  return notification;
}

export async function markAsRead(id: string): Promise<AppNotification> {
  await wait(120);
  let updated: AppNotification | undefined;
  notifications = notifications.map((n) => {
    if (n.id !== id) return n;
    updated = { ...n, read: true };
    return updated;
  });
  if (!updated) throw new Error('Notification not found.');
  return updated;
}

export async function markAllAsRead(userId: string): Promise<AppNotification[]> {
  await wait(120);
  notifications = notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n));
  return notifications.filter((n) => n.userId === userId);
}
