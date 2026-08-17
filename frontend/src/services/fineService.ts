import { request, type ApiResponse } from './api';

export interface FineRecord {
  id: string;
  user_id: string;
  borrowing_id?: string;
  amount: number;
  reason: string;
  status: 'pending' | 'paid' | 'waived';
  paid_at?: string | null;
  user_name?: string;
  user_email?: string;
  student_id?: string;
  book_title?: string;
  created_at: string;
}

export const fineService = {
  async getAll(params?: { user_id?: string; status?: string }): Promise<ApiResponse<FineRecord[]>> {
    const query = new URLSearchParams(params as any).toString();
    return request<FineRecord[]>(`/api/fines.php${query ? `?${query}` : ''}`);
  },

  async pay(id: string): Promise<ApiResponse<FineRecord>> {
    return request<FineRecord>('/api/fines.php?action=pay', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  async waive(id: string): Promise<ApiResponse<FineRecord>> {
    return request<FineRecord>('/api/fines.php?action=waive', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },
};
