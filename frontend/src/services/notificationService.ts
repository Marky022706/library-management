import { request, type ApiResponse } from './api';

export interface NotificationData {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read_status: number;
  created_at: string;
}

export const notificationService = {
  async getAll(): Promise<ApiResponse<NotificationData[]>> {
    return request<NotificationData[]>('/api/notifications.php');
  },

  async markAsRead(id: string): Promise<ApiResponse<void>> {
    return request<void>('/api/notifications.php?action=read', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return request<void>('/api/notifications.php?action=read_all', {
      method: 'POST',
    });
  },
};
