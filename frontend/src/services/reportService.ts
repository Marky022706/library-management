import { request, type ApiResponse } from './api';

export interface ReportOverviewData {
  total_books: number;
  total_quantity: number;
  available_books: number;
  borrowed_books: number;
  archived_books: number;
  total_users: number;
  members: number;
  active_members: number;
  pending_users: number;
  admins: number;
  active_borrowings: number;
  overdue_borrowings: number;
  pending_requests: number;
  pending_reservations: number;
  attendance_today: number;
  currently_inside: number;
  system_health: string;
  database_status: string;
}

export interface AnalyticsData {
  category_breakdown: Array<{ category: string; count: number; percent: number }>;
  attendance_trends: Array<{ date: string; count: number }>;
  borrowing_trends: Array<{ date: string; borrow_count: number }>;
}

export const reportService = {
  async getOverview(): Promise<ApiResponse<ReportOverviewData>> {
    return request<ReportOverviewData>('/api/reports.php?type=overview');
  },

  async getAnalytics(): Promise<ApiResponse<AnalyticsData>> {
    return request<AnalyticsData>('/api/reports.php?type=analytics');
  },

  async getCirculation(): Promise<ApiResponse<{ records: any[]; total: number }>> {
    return request('/api/reports.php?type=circulation');
  },

  async getAttendance(): Promise<ApiResponse<{ records: any[]; total: number }>> {
    return request('/api/reports.php?type=attendance');
  },

  async getInventory(): Promise<ApiResponse<{ records: any[]; total: number }>> {
    return request('/api/reports.php?type=inventory');
  },

  async getUsersReport(): Promise<ApiResponse<{ records: any[]; total: number }>> {
    return request('/api/reports.php?type=users');
  },

  getExportUrl(type: 'circulation' | 'attendance' | 'inventory' | 'users'): string {
    const token = localStorage.getItem('balingasag_session_token');
    return `http://127.0.0.1:8000/api/reports.php?type=${type}&format=csv${token ? `&token=${token}` : ''}`;
  },
};

