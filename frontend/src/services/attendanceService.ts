import type { AttendanceRecord } from '@/types';
import { mockAttendance } from '@/mock';
import { generateId } from '@/utils/id';
import { isoDate } from '@/utils/date';
import { wait } from '@/utils/wait';

let attendance: AttendanceRecord[] = [...mockAttendance];

export async function getAll(): Promise<AttendanceRecord[]> {
  await wait();
  return attendance;
}

/** Simulates a QR check-in scan for a member. */
export async function timeIn(userId: string, purpose?: string): Promise<AttendanceRecord> {
  await wait();
  const now = isoDate(new Date());
  const record: AttendanceRecord = {
    id: generateId('a'),
    userId,
    date: now,
    timeIn: now,
    status: 'inside',
    purpose,
  };
  attendance = [record, ...attendance];
  return record;
}

/** Simulates a QR check-out scan for a member currently inside. */
export async function timeOut(id: string): Promise<AttendanceRecord> {
  await wait();
  let updated: AttendanceRecord | undefined;
  attendance = attendance.map((record) => {
    if (record.id !== id) return record;
    updated = { ...record, timeOut: isoDate(new Date()), status: 'completed' };
    return updated;
  });
  if (!updated) throw new Error('Attendance record not found.');
  return updated;
}
