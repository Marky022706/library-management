import { request, type ApiResponse } from './api';

export interface RecycleBinItem {
  id: string;
  item_id: string;
  item_type: 'book' | 'user' | 'category' | 'author' | 'publisher';
  item_name: string;
  deleted_by: string;
  data_payload?: string;
  deleted_at: string;
}

export const recycleBinService = {
  async getAll(): Promise<ApiResponse<RecycleBinItem[]>> {
    return request<RecycleBinItem[]>('/api/recycle_bin.php');
  },

  async restore(id: string): Promise<ApiResponse<void>> {
    return request<void>(`/api/recycle_bin.php?action=restore&id=${id}`, {
      method: 'POST',
    });
  },

  async purge(id: string): Promise<ApiResponse<void>> {
    return request<void>(`/api/recycle_bin.php?action=purge&id=${id}`, {
      method: 'POST',
    });
  },
};
