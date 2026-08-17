import { request, type ApiResponse } from './api';

export interface FavoriteData {
  id: string;
  user_id: string;
  book_id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  available: number;
  cover_color: string;
  created_at: string;
}

export const favoriteService = {
  async getAll(): Promise<ApiResponse<FavoriteData[]>> {
    return request<FavoriteData[]>('/api/favorites.php');
  },

  async add(bookId: string): Promise<ApiResponse<{ ok: boolean; id: string }>> {
    return request('/api/favorites.php', {
      method: 'POST',
      body: JSON.stringify({ book_id: bookId }),
    });
  },

  async remove(bookId: string): Promise<ApiResponse<void>> {
    return request<void>(`/api/favorites.php?book_id=${bookId}`, {
      method: 'DELETE',
    });
  },
};
