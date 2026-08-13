import type { AttendanceRecord } from '../types';
import { MOCK_TODAY } from '../utils/date';

// 20 records total (Total Visitors), 5 of them on MOCK_TODAY (Today's
// Attendance), 2 of today's still `inside` (Currently Inside). The 18
// completed visits average out to ~1h45m (Avg. Visit Time), computed live
// in LibraryDataContext rather than hardcoded.
export const attendance: AttendanceRecord[] = [
  // --- historical (completed) ---
  { id: 'att-1', memberId: 'u-1', date: '2025-08-01', timeIn: '09:00', timeOut: '10:00', status: 'left' },
  { id: 'att-2', memberId: 'u-4', date: '2025-08-01', timeIn: '14:00', timeOut: '15:10', status: 'left' },
  { id: 'att-3', memberId: 'u-6', date: '2025-08-02', timeIn: '08:30', timeOut: '09:25', status: 'left' },
  { id: 'att-4', memberId: 'u-9', date: '2025-08-02', timeIn: '13:00', timeOut: '14:20', status: 'left' },
  { id: 'att-5', memberId: 'u-10', date: '2025-08-03', timeIn: '10:15', timeOut: '11:00', status: 'left' },
  { id: 'att-6', memberId: 'u-2', date: '2025-08-03', timeIn: '16:00', timeOut: '17:30', status: 'left' },
  { id: 'att-7', memberId: 'u-1', date: '2025-08-04', timeIn: '09:30', timeOut: '10:20', status: 'left' },
  { id: 'att-8', memberId: 'u-6', date: '2025-08-04', timeIn: '11:00', timeOut: '12:15', status: 'left' },
  { id: 'att-9', memberId: 'u-9', date: '2025-08-05', timeIn: '08:45', timeOut: '09:45', status: 'left' },
  { id: 'att-10', memberId: 'u-4', date: '2025-08-05', timeIn: '15:00', timeOut: '16:05', status: 'left' },
  { id: 'att-11', memberId: 'u-10', date: '2025-08-06', timeIn: '09:10', timeOut: '10:20', status: 'left' },
  { id: 'att-12', memberId: 'u-1', date: '2025-08-06', timeIn: '13:30', timeOut: '14:25', status: 'left' },
  { id: 'att-13', memberId: 'u-6', date: '2025-08-07', timeIn: '10:00', timeOut: '11:20', status: 'left' },
  { id: 'att-14', memberId: 'u-9', date: '2025-08-08', timeIn: '09:00', timeOut: '10:00', status: 'left' },
  { id: 'att-15', memberId: 'u-2', date: '2025-08-09', timeIn: '14:30', timeOut: '15:40', status: 'left' },

  // --- today (MOCK_TODAY = 2025-08-11) ---
  { id: 'att-16', memberId: 'u-1', date: MOCK_TODAY, timeIn: '08:15', timeOut: '10:30', status: 'left' },
  { id: 'att-17', memberId: 'u-4', date: MOCK_TODAY, timeIn: '09:00', timeOut: '20:16', status: 'left' },
  { id: 'att-18', memberId: 'u-6', date: MOCK_TODAY, timeIn: '07:45', timeOut: '09:20', status: 'left' },
  { id: 'att-19', memberId: 'u-9', date: MOCK_TODAY, timeIn: '10:00', status: 'inside' },
  { id: 'att-20', memberId: 'u-10', date: MOCK_TODAY, timeIn: '10:30', status: 'inside' },
];
