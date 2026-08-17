import { request, type ApiResponse } from './api';

export interface BorrowingRecord {
  id: string;
  user_id: string;
  book_id: string;
  borrow_date: string;
  due_date: string;
  return_date?: string | null;
  status: 'active' | 'returned' | 'overdue' | 'renewed';
  renew_count: number;
  fine_amount: number;
  user_name?: string;
  user_email?: string;
  student_id?: string;
  book_title?: string;
  book_author?: string;
  book_isbn?: string;
  cover_color?: string;
}

export const borrowingService = {
  async getAll(params?: { user_id?: string; status?: string; search?: string }): Promise<ApiResponse<BorrowingRecord[]>> {
    const query = new URLSearchParams(params as any).toString();
    return request<BorrowingRecord[]>(`/api/borrowings.php${query ? `?${query}` : ''}`);
  },

  async borrowBook(bookId: string, userId?: string, dueDate?: string): Promise<ApiResponse<BorrowingRecord>> {
    return request<BorrowingRecord>('/api/borrowings.php?action=borrow', {
      method: 'POST',
      body: JSON.stringify({ book_id: bookId, user_id: userId, due_date: dueDate }),
    });
  },

  async returnBook(id: string): Promise<ApiResponse<BorrowingRecord>> {
    return request<BorrowingRecord>('/api/borrowings.php?action=return', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },

  async renewLoan(id: string): Promise<ApiResponse<BorrowingRecord>> {
    return request<BorrowingRecord>('/api/borrowings.php?action=renew', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  },
};
