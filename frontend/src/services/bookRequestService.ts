import { request, type ApiResponse } from './api';

export interface BookRequestData {
  id: string;
  user_id: string;
  request_type: 'borrowing' | 'acquisition' | 'archive';
  book_id?: string | null;
  title: string;
  author?: string | null;
  publisher?: string | null;
  isbn?: string | null;
  reason?: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approver_id?: string | null;
  approver_name?: string | null;
  user_name?: string;
  user_email?: string;
  student_id?: string;
  remarks?: string | null;
  created_at: string;
}

export const bookRequestService = {
  async getAll(params?: { user_id?: string; status?: string; request_type?: string }): Promise<ApiResponse<BookRequestData[]>> {
    const query = new URLSearchParams(params as any).toString();
    return request<BookRequestData[]>(`/api/book_requests.php${query ? `?${query}` : ''}`);
  },

  async create(data: { title: string; author?: string; publisher?: string; isbn?: string; reason?: string; request_type?: string; book_id?: string }): Promise<ApiResponse<BookRequestData>> {
    return request<BookRequestData>('/api/book_requests.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async process(id: string, status: 'approved' | 'rejected', remarks?: string): Promise<ApiResponse<BookRequestData>> {
    return request<BookRequestData>(`/api/book_requests.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, remarks }),
    });
  },
};
