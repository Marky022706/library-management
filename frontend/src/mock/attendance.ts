import type { AttendanceRecord } from '@/types';

function atTime(daysBack: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function dateOnly(daysBack: number): string {
  return atTime(daysBack, 0, 0);
}

export const mockAttendance: AttendanceRecord[] = [
  // Today — some still inside the library
  { id: 'a1', userId: 'u3', date: dateOnly(0), timeIn: atTime(0, 8, 5), status: 'inside', purpose: 'Reading & Research' },
  { id: 'a2', userId: 'u4', date: dateOnly(0), timeIn: atTime(0, 9, 12), timeOut: atTime(0, 11, 30), status: 'completed', purpose: 'Borrow Book' },
  { id: 'a3', userId: 'u8', date: dateOnly(0), timeIn: atTime(0, 10, 0), status: 'inside', purpose: 'Study' },
  { id: 'a4', userId: 'u5', date: dateOnly(0), timeIn: atTime(0, 13, 15), timeOut: atTime(0, 15, 40), status: 'completed', purpose: 'Internet Access' },

  // Yesterday
  { id: 'a5', userId: 'u3', date: dateOnly(1), timeIn: atTime(1, 8, 20), timeOut: atTime(1, 10, 45), status: 'completed', purpose: 'Return Book' },
  { id: 'a6', userId: 'u6', date: dateOnly(1), timeIn: atTime(1, 9, 5), timeOut: atTime(1, 11, 0), status: 'completed', purpose: 'Reading & Research' },
  { id: 'a7', userId: 'u7', date: dateOnly(1), timeIn: atTime(1, 13, 30), timeOut: atTime(1, 16, 10), status: 'completed', purpose: 'Study' },
  { id: 'a8', userId: 'u9', date: dateOnly(1), timeIn: atTime(1, 14, 0), timeOut: atTime(1, 15, 20), status: 'completed', purpose: 'Borrow Book' },
  { id: 'a9', userId: 'u10', date: dateOnly(1), timeIn: atTime(1, 10, 40), timeOut: atTime(1, 12, 15), status: 'completed', purpose: 'Reading & Research' },

  // 2 days ago
  { id: 'a10', userId: 'u4', date: dateOnly(2), timeIn: atTime(2, 8, 45), timeOut: atTime(2, 10, 30), status: 'completed', purpose: 'Study' },
  { id: 'a11', userId: 'u5', date: dateOnly(2), timeIn: atTime(2, 9, 30), timeOut: atTime(2, 11, 50), status: 'completed', purpose: 'Internet Access' },
  { id: 'a12', userId: 'u8', date: dateOnly(2), timeIn: atTime(2, 13, 0), timeOut: atTime(2, 14, 45), status: 'completed', purpose: 'Borrow Book' },
  { id: 'a13', userId: 'u3', date: dateOnly(2), timeIn: atTime(2, 15, 10), timeOut: atTime(2, 17, 0), status: 'completed', purpose: 'Reading & Research' },

  // 3 days ago
  { id: 'a14', userId: 'u6', date: dateOnly(3), timeIn: atTime(3, 8, 15), timeOut: atTime(3, 9, 40), status: 'completed', purpose: 'Return Book' },
  { id: 'a15', userId: 'u9', date: dateOnly(3), timeIn: atTime(3, 10, 5), timeOut: atTime(3, 12, 0), status: 'completed', purpose: 'Study' },
  { id: 'a16', userId: 'u10', date: dateOnly(3), timeIn: atTime(3, 13, 20), timeOut: atTime(3, 15, 0), status: 'completed', purpose: 'Reading & Research' },
  { id: 'a17', userId: 'u7', date: dateOnly(3), timeIn: atTime(3, 14, 10), timeOut: atTime(3, 16, 30), status: 'completed', purpose: 'Internet Access' },

  // 4 days ago
  { id: 'a18', userId: 'u3', date: dateOnly(4), timeIn: atTime(4, 8, 0), timeOut: atTime(4, 9, 20), status: 'completed', purpose: 'Borrow Book' },
  { id: 'a19', userId: 'u4', date: dateOnly(4), timeIn: atTime(4, 9, 45), timeOut: atTime(4, 11, 10), status: 'completed', purpose: 'Study' },
  { id: 'a20', userId: 'u5', date: dateOnly(4), timeIn: atTime(4, 13, 40), timeOut: atTime(4, 15, 30), status: 'completed', purpose: 'Reading & Research' },

  // 5 days ago
  { id: 'a21', userId: 'u8', date: dateOnly(5), timeIn: atTime(5, 8, 30), timeOut: atTime(5, 10, 10), status: 'completed', purpose: 'Reading & Research' },
  { id: 'a22', userId: 'u9', date: dateOnly(5), timeIn: atTime(5, 11, 0), timeOut: atTime(5, 12, 30), status: 'completed', purpose: 'Study' },
  { id: 'a23', userId: 'u10', date: dateOnly(5), timeIn: atTime(5, 14, 15), timeOut: atTime(5, 15, 45), status: 'completed', purpose: 'Internet Access' },
];
