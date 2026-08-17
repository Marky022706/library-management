import { request, type ApiResponse } from './api';

export interface Publisher {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export const publisherService = {
  async getAll(search?: string): Promise<ApiResponse<{ publishers: Publisher[]; total: number }>> {
    return request(`/api/publishers.php${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  async getById(id: string): Promise<ApiResponse<{ publisher: Publisher }>> {
    return request(`/api/publishers.php?id=${encodeURIComponent(id)}`);
  },

  async create(name: string): Promise<ApiResponse<{ publisher: Publisher }>> {
    return request('/api/publishers.php', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async update(id: string, name: string): Promise<ApiResponse<{ publisher: Publisher }>> {
    return request(`/api/publishers.php?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  async delete(id: string): Promise<ApiResponse> {
    return request(`/api/publishers.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
