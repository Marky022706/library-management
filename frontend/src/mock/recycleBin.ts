import type { RecycleBinItem } from '@/types';
import { daysAgo } from '@/utils/date';

export const mockRecycleBin: RecycleBinItem[] = [
  { id: 'rb1', category: 'Books', refId: 'b-deleted-1', name: 'Introduction to Philippine History (2nd Ed.)', description: 'Superseded by a newer edition; removed from active catalog.', deletedAt: daysAgo(40), deletedBy: 'Maricel Dagohoy' },
  { id: 'rb2', category: 'Users', refId: 'u-deleted-1', name: 'Marites OngPin (test account)', description: 'Duplicate registration removed after verification.', deletedAt: daysAgo(25), deletedBy: 'Ricardo Salazar' },
  { id: 'rb3', category: 'Announcements', refId: 'ann-deleted-1', name: 'Library Closed for Fiesta (2025)', description: 'Expired announcement from last year\'s town fiesta closure.', deletedAt: daysAgo(70), deletedBy: 'Maricel Dagohoy' },
  { id: 'rb4', category: 'Books', refId: 'b-deleted-2', name: 'Basic English Grammar Workbook', description: 'Water-damaged copy removed pending replacement.', deletedAt: daysAgo(12), deletedBy: 'Teodoro Villanueva' },
  { id: 'rb5', category: 'Users', refId: 'u-deleted-2', name: 'Test Account (QA)', description: 'Internal QA test account cleaned up after system testing.', deletedAt: daysAgo(5), deletedBy: 'Ricardo Salazar' },
];
