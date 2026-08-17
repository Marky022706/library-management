import { request, type ApiResponse } from './api';

export interface SettingItem {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_group: string;
  description: string;
}

export const settingsService = {
  async getAll(): Promise<ApiResponse<SettingItem[]>> {
    return request<SettingItem[]>('/api/settings.php');
  },

  async update(key: string, value: string): Promise<ApiResponse<void>> {
    return request<void>('/api/settings.php', {
      method: 'PUT',
      body: JSON.stringify({ key, value }),
    });
  },
};
