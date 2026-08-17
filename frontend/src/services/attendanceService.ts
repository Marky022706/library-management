import { request, type ApiResponse } from './api';

export interface AttendanceRecordData {
  id: string;
  user_id: string;
  date: string;
  time_in: string;
  time_out?: string | null;
  status: 'inside' | 'left';
  source?: string;
  user_name?: string;
  user_email?: string;
  student_id?: string;
  course?: string;
}

export const attendanceService = {
  async getAll(params?: { user_id?: string; date?: string; status?: string }): Promise<ApiResponse<AttendanceRecordData[]>> {
    const query = new URLSearchParams(params as any).toString();
    return request<AttendanceRecordData[]>(`/api/attendance.php${query ? `?${query}` : ''}`);
  },

  async scanQR(userId?: string): Promise<ApiResponse<{ action: string; message: string; status: string }>> {
    return request('/api/attendance.php?action=scan', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  },

  async checkIn(userId?: string): Promise<ApiResponse<any>> {
    return request('/api/attendance.php?action=checkin', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  },

  async checkOut(userId?: string): Promise<ApiResponse<any>> {
    return request('/api/attendance.php?action=checkout', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  },
};
