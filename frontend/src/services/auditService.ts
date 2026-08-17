import { request, type ApiResponse } from './api';

export interface AuditLogData {
  id: string;
  user_id: string;
  user_name: string;
  role: string;
  action: string;
  module: string;
  target_id?: string;
  description: string;
  ip_address: string;
  status: string;
  created_at: string;
}

export const auditService = {
  async getAll(params?: { module?: string; search?: string }): Promise<ApiResponse<AuditLogData[]>> {
    const query = new URLSearchParams(params as any).toString();
    return request<AuditLogData[]>(`/api/audit_logs.php${query ? `?${query}` : ''}`);
  },
};
