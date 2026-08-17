import { request, type ApiResponse } from './api';

export interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  status: 'published' | 'draft' | 'archived';
  publish_date: string;
  expiration_date?: string | null;
  author_name?: string;
  created_at: string;
}

export const announcementService = {
  async getAll(includeDrafts = false): Promise<ApiResponse<AnnouncementData[]>> {
    return request<AnnouncementData[]>(`/api/announcements.php${includeDrafts ? '?all=1' : ''}`);
  },

  async create(data: { title: string; content: string; status?: string; publish_date?: string; expiration_date?: string }): Promise<ApiResponse<AnnouncementData>> {
    return request<AnnouncementData>('/api/announcements.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, patch: Partial<AnnouncementData>): Promise<ApiResponse<void>> {
    return request<void>(`/api/announcements.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    });
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return request<void>(`/api/announcements.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};
