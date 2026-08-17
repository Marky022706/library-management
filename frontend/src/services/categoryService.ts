import { request, type ApiResponse } from './api';

export interface Category {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export const categoryService = {
  async getAll(search?: string): Promise<ApiResponse<{ categories: Category[]; total: number }>> {
    return request(`/api/categories.php${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  async getById(id: string): Promise<ApiResponse<{ category: Category }>> {
    return request(`/api/categories.php?id=${encodeURIComponent(id)}`);
  },

  async create(name: string): Promise<ApiResponse<{ category: Category }>> {
    return request('/api/categories.php', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async update(id: string, name: string): Promise<ApiResponse<{ category: Category }>> {
    return request(`/api/categories.php?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  async delete(id: string): Promise<ApiResponse> {
    return request(`/api/categories.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
