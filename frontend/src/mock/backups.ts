import type { BackupRecord } from '@/types';
import { daysAgo } from '@/utils/date';

export const mockBackups: BackupRecord[] = [
  { id: 'bk1', createdAt: daysAgo(7), sizeMb: 412, createdBy: 'Ricardo Salazar', status: 'completed' },
  { id: 'bk2', createdAt: daysAgo(14), sizeMb: 405, createdBy: 'Ricardo Salazar', status: 'completed' },
  { id: 'bk3', createdAt: daysAgo(21), sizeMb: 398, createdBy: 'System Scheduler', status: 'completed' },
  { id: 'bk4', createdAt: daysAgo(28), sizeMb: 0, createdBy: 'System Scheduler', status: 'failed' },
  { id: 'bk5', createdAt: daysAgo(35), sizeMb: 380, createdBy: 'Ricardo Salazar', status: 'completed' },
];
