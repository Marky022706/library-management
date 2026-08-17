import { request, type ApiResponse } from './api';

export interface BackupRecord {
  id: string;
  filename: string;
  file_size: string;
  total_tables: number;
  status: string;
  created_by?: string;
  created_at: string;
}

export const backupService = {
  async getAll(): Promise<ApiResponse<BackupRecord[]>> {
    return request<BackupRecord[]>('/api/backups.php');
  },

  async create(): Promise<ApiResponse<BackupRecord>> {
    return request<BackupRecord>('/api/backups.php', {
      method: 'POST',
    });
  },
};
