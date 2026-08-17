import { request, type ApiResponse } from './api';
import type { Book } from '../types';

export interface BookInput {
  title: string;
  author: string;
  category: string;
  publisher?: string;
  publication_year?: number;
  isbn?: string;
  accession_number?: string;
  shelf_location?: string;
  format?: string;
  quantity?: number;
  available?: number;
  condition?: string;
  coverColor?: string;
}

export const bookService = {
  async getBooks(params: { category?: string; author?: string; publisher?: string; status?: string; search?: string } = {}): Promise<ApiResponse<{ books: Book[]; total: number }>> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return request(`/api/books.php?${query}`);
  },

  async getBookById(id: string): Promise<ApiResponse<{ book: Book }>> {
    return request(`/api/books.php?id=${id}`);
  },

  async createBook(input: BookInput): Promise<ApiResponse<{ book: Book }>> {
    return request('/api/books.php', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async updateBook(id: string, patch: Partial<BookInput>): Promise<ApiResponse<{ book: Book }>> {
    return request(`/api/books.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
  },

  async archiveBook(id: string): Promise<ApiResponse> {
    return request(`/api/books.php?id=${id}`, {
      method: 'DELETE',
    });
  },

  async restoreBook(id: string): Promise<ApiResponse> {
    return request(`/api/books.php?action=restore&id=${id}`, {
      method: 'POST',
    });
  },
};
