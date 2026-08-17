import { request, type ApiResponse } from './api';

export interface Author {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export const authorService = {
  async getAll(search?: string): Promise<ApiResponse<{ authors: Author[]; total: number }>> {
    return request(`/api/authors.php${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  async getById(id: string): Promise<ApiResponse<{ author: Author }>> {
    return request(`/api/authors.php?id=${encodeURIComponent(id)}`);
  },

  async create(name: string): Promise<ApiResponse<{ author: Author }>> {
    return request('/api/authors.php', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async update(id: string, name: string): Promise<ApiResponse<{ author: Author }>> {
    return request(`/api/authors.php?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  async delete(id: string): Promise<ApiResponse> {
    return request(`/api/authors.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
