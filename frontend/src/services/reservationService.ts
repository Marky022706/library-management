import { request, type ApiResponse } from './api';

export interface ReservationRecord {
  id: string;
  user_id: string;
  book_id: string;
  reserved_date: string;
  pickup_deadline?: string | null;
  status: 'pending' | 'ready_for_pickup' | 'completed' | 'cancelled' | 'expired';
  user_name?: string;
  book_title?: string;
  book_author?: string;
  cover_color?: string;
}

export const reservationService = {
  async getAll(params?: { user_id?: string; status?: string }): Promise<ApiResponse<ReservationRecord[]>> {
    const query = new URLSearchParams(params as any).toString();
    return request<ReservationRecord[]>(`/api/reservations.php${query ? `?${query}` : ''}`);
  },

  async create(bookId: string, userId?: string): Promise<ApiResponse<ReservationRecord>> {
    return request<ReservationRecord>('/api/reservations.php', {
      method: 'POST',
      body: JSON.stringify({ book_id: bookId, user_id: userId }),
    });
  },

  async updateStatus(id: string, status: string, pickupDeadline?: string): Promise<ApiResponse<ReservationRecord>> {
    return request<ReservationRecord>(`/api/reservations.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, pickup_deadline: pickupDeadline }),
    });
  },

  async cancel(id: string): Promise<ApiResponse<void>> {
    return request<void>(`/api/reservations.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};
