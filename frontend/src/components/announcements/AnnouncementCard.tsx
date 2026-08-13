import { Archive, RotateCcw, SquarePen } from 'lucide-react';
import type { Announcement } from '../../types';
import { Badge, type BadgeTone } from '../common/Badge';
import { formatDate } from '../../utils/date';

interface AnnouncementCardProps {
  announcement: Announcement;
  onEdit: (announcement: Announcement) => void;
  onToggleArchive: (announcement: Announcement) => void;
}

const STATUS_TONE: Record<Announcement['status'], BadgeTone> = {
  published: 'green',
  draft: 'amber',
  archived: 'neutral',
};

export function AnnouncementCard({ announcement, onEdit, onToggleArchive }: AnnouncementCardProps) {
  const isArchived = announcement.status === 'archived';

  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge tone={STATUS_TONE[announcement.status]}>{announcement.status}</Badge>
          <span className="text-sm text-muted">{formatDate(announcement.date)}</span>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(announcement)}
            title="Edit announcement"
            aria-label={`Edit ${announcement.title}`}
            className="rounded-lg p-2 text-muted hover:bg-gray-100 hover:text-ink"
          >
            <SquarePen className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onToggleArchive(announcement)}
            title={isArchived ? 'Restore announcement' : 'Archive announcement'}
            aria-label={`${isArchived ? 'Restore' : 'Archive'} ${announcement.title}`}
            className="rounded-lg p-2 text-muted hover:bg-gray-100 hover:text-ink"
          >
            {isArchived ? <RotateCcw className="h-4 w-4" aria-hidden="true" /> : <Archive className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <h3 className="mt-3 text-base font-semibold text-ink">{announcement.title}</h3>
      <p className="mt-1.5 text-sm text-muted">{announcement.content}</p>
    </article>
  );
}
