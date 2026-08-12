export type AttendanceStatus = 'inside' | 'completed';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  timeIn: string;
  timeOut?: string;
  status: AttendanceStatus;
  purpose?: string;
}
