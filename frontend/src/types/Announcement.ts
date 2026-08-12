export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  authorId: string;
  createdAt: string;
  publishedAt?: string;
}
