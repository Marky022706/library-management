export type BackupStatus = 'completed' | 'failed' | 'in-progress';

export interface BackupRecord {
  id: string;
  createdAt: string;
  sizeMb: number;
  createdBy: string;
  status: BackupStatus;
}
