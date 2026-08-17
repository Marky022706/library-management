import { request, type ApiResponse } from './api';

export interface Category {
  id: string;
  name: string;
}

export interface Author {
  id: string;
  name: string;
}

export interface Publisher {
  id: string;
  name: string;
}

export const catalogService = {
  // Categories
  async getCategories(search?: string): Promise<ApiResponse<{ categories: Category[] }>> {
    return request(`/api/categories.php${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  async createCategory(name: string): Promise<ApiResponse<{ category: Category }>> {
    return request('/api/categories.php', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async updateCategory(id: string, name: string): Promise<ApiResponse<{ category: Category }>> {
    return request(`/api/categories.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  async deleteCategory(id: string): Promise<ApiResponse> {
    return request(`/api/categories.php?id=${id}`, { method: 'DELETE' });
  },

  // Authors
  async getAuthors(search?: string): Promise<ApiResponse<{ authors: Author[] }>> {
    return request(`/api/authors.php${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  async createAuthor(name: string): Promise<ApiResponse<{ author: Author }>> {
    return request('/api/authors.php', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async updateAuthor(id: string, name: string): Promise<ApiResponse<{ author: Author }>> {
    return request(`/api/authors.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  async deleteAuthor(id: string): Promise<ApiResponse> {
    return request(`/api/authors.php?id=${id}`, { method: 'DELETE' });
  },

  // Publishers
  async getPublishers(search?: string): Promise<ApiResponse<{ publishers: Publisher[] }>> {
    return request(`/api/publishers.php${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  async createPublisher(name: string): Promise<ApiResponse<{ publisher: Publisher }>> {
    return request('/api/publishers.php', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },

  async updatePublisher(id: string, name: string): Promise<ApiResponse<{ publisher: Publisher }>> {
    return request(`/api/publishers.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  },

  async deletePublisher(id: string): Promise<ApiResponse> {
    return request(`/api/publishers.php?id=${id}`, { method: 'DELETE' });
  },
};
