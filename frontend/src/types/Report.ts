export type ReportCategory =
  | 'Borrowing'
  | 'Attendance'
  | 'Inventory'
  | 'Overdue'
  | 'Book Conditions'
  | 'Requests'
  | 'Member Activities'
  | 'Login History'
  | 'Audit Logs'
  | 'System Activity';

export interface ReportFilter {
  category: ReportCategory;
  startDate: string;
  endDate: string;
}

export interface GeneratedReport {
  id: string;
  category: ReportCategory;
  startDate: string;
  endDate: string;
  generatedAt: string;
  rowCount: number;
  summary: string;
}
