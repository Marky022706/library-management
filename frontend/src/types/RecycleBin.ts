export type RecycleBinCategory = 'Books' | 'Users' | 'Announcements';

export interface RecycleBinItem {
  id: string;
  category: RecycleBinCategory;
  refId: string;
  name: string;
  description: string;
  deletedAt: string;
  deletedBy: string;
}
